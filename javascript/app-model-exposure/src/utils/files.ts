/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { BaseFile, FileCollection } from '@datashaper/utilities'
import {
	createBaseFile,
	createFile,
	createReader,
	FileType,
} from '@datashaper/utilities'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'

import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'
import type { ZipFileData } from '../types/files/ZipFileData.js'
import type { Maybe } from '../types/primitives.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import { createDefaultTable } from './arquero.js'

const CHUNK_SIZE = 31457280 //1024 * 1024 * 30
const MAX_FILE_SIZE = 350000000 //350MB

export function isZipUrl(url: string): boolean {
	return url.toLowerCase().startsWith(FileType.zip)
}

export function isDataUrl(url: string): boolean {
	return /^data:/.test(url.toLowerCase())
}

export async function groupFilesByType(
	fileCollection: FileCollection,
): Promise<ZipFileData> {
	const filesByType: ZipFileData = {
		name: fileCollection.name || 'FileCollection',
	}
	const resultsRegExp = /result(.+).(c|t)sv/gi
	const configRegExp = /config(.*).json$/gi
	const runHistoryRegExp = /run(.*)history(.*).json$/gi
	const significanceTestRegExp = /significance(.*)tests(.*).json$/gi
	const isResult = (filename: string) => resultsRegExp.test(filename)
	const tableFiles: BaseFile[] = fileCollection.list(FileType.table)

	const jsonFiles = fileCollection.list(FileType.json)
	const configFile = jsonFiles.find((f) => configRegExp.test(f.name))

	let defaultResult
	if (configFile) {
		const json = await configFile.toJson()
		filesByType[FileType.json] = json
		defaultResult = json['defaultResult'] //eslint-disable-line
	}

	if (defaultResult) {
		let file: Maybe<BaseFile>
		let { url }: { url: string } = defaultResult //eslint-disable-line
		if (isZipUrl(url)) {
			file = tableFiles.find((f) => url.includes(f.name))
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
		const file = tableFiles.find((file) => isResult(file.name))
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

	const tables: BaseFile[] = tableFiles.filter((file) => !isResult(file.name))
	if (tables.length > 0) {
		filesByType['tables'] = tables
	}

	const runHistoryFile = jsonFiles.find((f) => runHistoryRegExp.test(f.name))
	if (runHistoryFile) {
		const json = await runHistoryFile.toJson()
		filesByType['runHistory'] = json as RunHistory[]
		defaultResult = json['defaultResult'] //eslint-disable-line
	}
	const significanceTestsFile = jsonFiles.find((f) =>
		significanceTestRegExp.test(f.name),
	)
	if (significanceTestsFile) {
		const json = await significanceTestsFile.toJson()
		filesByType['significanceTests'] = json as SignificanceTestStatus[]
		defaultResult = json['significanceTests'] //eslint-disable-line
	}
	return filesByType
}

export async function getDataURL(blob: Blob): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = createReader()
		reader.onload = () => {
			try {
				resolve(reader.result as string)
			} catch (e) {
				reject(e)
			}
		}
		reader.readAsDataURL(blob)
	})
}

export function createFormData(file: ColumnTable, name: string): FormData {
	const formData = new FormData()
	const content = file.toCSV()
	const type = { type: 'text/csv' }
	const blob = new Blob([content], type)
	const fileContent = createFile(blob, { name: name })
	formData.append('file', fileContent)
	return formData
}

/**
 * Reads files and return a columnTable when finished
 * If the file is > 350MB, reads it in chunks.
 * Get's the first row as columnNames
 * Reads the file every 3MB, then breaks it by the last line break
 * Adds the rest of the line for the next iteration
 * Creates a ColumnTable and concatenate it with the previous in every iteration
 * returns a promise with the ColumnTable created when it's done
 * @param file
 * @param delimiter
 * @returns
 */
export function readFile(
	file: BaseFile | File,
	delimiter: string,
	autoType = false,
	onProgress?: (processed: number, total: number) => void,
): Promise<ColumnTable> {
	const isBigFile = file.size > MAX_FILE_SIZE
	const reader = createReader()
	let index = 0
	const size = CHUNK_SIZE
	let columnNames: string[] = []
	let error = ''
	let table: ColumnTable | undefined = undefined

	reader.onload = () => {
		isBigFile && onProgress && onProgress(index, file.size)
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
			const result = createDefaultTable(
				lineBreak,
				delimiter,
				columnNames,
				autoType,
			)
			if (!table) {
				table = result
			} else {
				table = table?.concat(result)
			}
		} catch (e) {
			error = e as string
		}
	}

	if (isBigFile) {
		reader.readAsBinaryString(file.slice(index, index + size))
	} else {
		reader.readAsBinaryString(file)
	}

	return new Promise((resolve) => {
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
