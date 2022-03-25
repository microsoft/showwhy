/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BaseFile,
	FileCollection,
} from '@data-wrangling-components/utilities'
import {
	createBaseFile,
	createReader,
	FileType,
	FileWithPath,
	guessDelimiter,
} from '@data-wrangling-components/utilities'
import type { Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { DataTableFileDefinition, RunHistory, ZipData } from '~types'

import { createDefaultTable, fetchTable } from './arquero'

const CHUNK_SIZE = 31457280 //1024 * 1024 * 30
const MAX_FILE_SIZE = 350000000 //350MB

export function createTextFile(name: string, content: string): File {
	const type = { type: `text/${name.split('.').pop()}` }
	const blob = new Blob([content], type)
	return new File([blob], name, type)
}

export function createFormData(file: ColumnTable, name: string): FormData {
	const content = file.toCSV()
	const formData = new FormData()
	const _file = createTextFile(name, content)
	formData.append(`file`, _file)
	return formData
}

export function isZipUrl(url: string): boolean {
	return url.toLowerCase().startsWith(FileType.zip)
}

export function isUrl(url: string): boolean {
	return /^https?:\/\//.test(url.toLowerCase())
}

export function isDataUrl(url: string): boolean {
	return /^data:/.test(url.toLowerCase())
}

export async function groupFilesByType(
	fileCollection: FileCollection,
): Promise<ZipData> {
	const filesByType: ZipData = {
		name: fileCollection.name || 'FileCollection',
	}
	const resultsRegExp = /result(.+).(c|t)sv/gi
	const configRegExp = /config(.*).json$/gi
	const runHistoryRegExp = /run(.*)history(.*).json$/gi
	const isResult = (filename: string) => resultsRegExp.test(filename)
	const tableFiles: BaseFile[] = fileCollection.list(FileType.table)

	const jsonFiles = fileCollection.list(FileType.json)
	const configFile = jsonFiles.find(f => configRegExp.test(f.name))
	let defaultResult
	if (configFile) {
		const json = await configFile.toJson()
		filesByType[FileType.json] = json
		defaultResult = json['defaultResult']
	}

	if (defaultResult) {
		let file: Maybe<BaseFile>
		let { url } = defaultResult
		if (isZipUrl(url)) {
			file = tableFiles.find(f => url.includes(f.name))
			if (file) {
				file = createBaseFile(file, { name: file.name })
				url = await file.toDataURL()
			}
		}

		if (file) {
			filesByType['results'] = {
				file,
				dataUri: url,
			}
		}
	} else {
		//TODO: It gets the first coincidence, should it be an array instead?
		const file = tableFiles.find(file => isResult(file.name))
		if (file) {
			filesByType['results'] = {
				file,
				dataUri: await file.toDataURL(),
			}
		}
	}

	const notebooks: BaseFile[] = fileCollection.list(FileType.ipynb)

	if (notebooks.length > 0) {
		filesByType['notebooks'] = notebooks
	}

	const tables: BaseFile[] = tableFiles.filter(file => !isResult(file.name))
	if (tables.length > 0) {
		filesByType['tables'] = tables
	}

	const runHistoryFile = jsonFiles.find(f => runHistoryRegExp.test(f.name))
	if (runHistoryFile) {
		const json = await runHistoryFile.toJson()
		filesByType['runHistory'] = json as RunHistory[]
		defaultResult = json['defaultResult']
	}
	return filesByType
}

export async function fetchRemoteTables(
	tables: DataTableFileDefinition[],
): Promise<FileWithPath[]> {
	tables = tables.filter(table => isUrl(table.url))
	const tableFiles: FileWithPath[] = []
	for await (const table of tables) {
		const fetched = await fetchTable(table)
		const file = new File([fetched.toCSV()], table.name, { type: 'text/csv' })
		tableFiles.push(new FileWithPath(file, table.name, ''))
	}
	return tableFiles
}

/**
 *
 * @param file
 * @param delimiter
 * @returns
 */
export function readFile(
	file: BaseFile | File,
	delimiter?: string,
): Promise<ColumnTable> {
	const _delimeter = delimiter || guessDelimiter(file.name)
	const isBigFile = file.size > MAX_FILE_SIZE
	const reader = createReader()
	let index = 0
	const size = CHUNK_SIZE
	let columnNames: string[] = []
	let error = ''
	let table: ColumnTable | undefined = undefined

	reader.onload = () => {
		console.debug('file reading started')
		const content = reader.result
			? reader.result.toString().replace(/ï»¿/g, '')
			: ''

		let lineBreak = content
		let columnsIndex = 0
		if (isBigFile) {
			/**
			 * stores columnNames
			 */
			if (index === 0) {
				columnsIndex = content.indexOf('\n')
				const columns = content.slice(0, columnsIndex)
				columnNames = columns.split(',')
				/**
				 * include \n into account
				 */
				columnsIndex++
			}

			lineBreak =
				content.length < size
					? content
					: content.slice(columnsIndex, content.lastIndexOf('\n') + 1)
			const lineBreakExcess = content.length - lineBreak.length - columnsIndex

			index = index + size - lineBreakExcess
		}
		try {
			const result = createDefaultTable(lineBreak, _delimeter, columnNames)
			if (!table) {
				table = result
			} else {
				table = table?.concat(result)
			}
		} catch (e: any) {
			error = e
		}
	}

	if (isBigFile) {
		reader.readAsBinaryString(file.slice(index, index + size))
	} else {
		reader.readAsBinaryString(file)
	}

	return new Promise(resolve => {
		reader.onloadend = () => {
			if (error) {
				console.log('file reading has failed')
			}
			if (isBigFile && index < file.size) {
				reader.readAsBinaryString(file.slice(index, index + size))
			} else {
				console.debug('file reading ended')
				return resolve(table as ColumnTable)
			}
		}
	})
}
