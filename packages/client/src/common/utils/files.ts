/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	FileType,
	BaseFile,
	FileWithPath,
	createBaseFile,
} from '@data-wrangling-components/utilities'
import { fetchTable } from './arquero'
import { DataTableFileDefinition, ProjectFile, ZipData } from '~interfaces'

export function createTextFile(name: string, content: string): File {
	const type = { type: `text/${name.split('.').pop()}` }
	const blob = new Blob([content], type)
	return new File([blob], name, type)
}

export function createFormData(files: ProjectFile[]): FormData {
	const formData = new FormData()
	files.forEach((f, i) => {
		const file = createTextFile(f.name, f.content)
		formData.append(`file${i}`, file)
	})
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

export const groupFilesByType = async (
	fileCollection: FileCollection,
): Promise<ZipData> => {
	const filesByType: ZipData = {
		name: fileCollection.name || 'FileCollection',
	}
	const resultsRegExp = /result(.+).(c|t)sv/gi
	const isResult = filename => resultsRegExp.test(filename)
	const tableFiles: BaseFile[] = fileCollection.list(FileType.table)

	const [jsonFile] = fileCollection.list(FileType.json)
	let defaultResult
	if (jsonFile) {
		const json = await jsonFile.toJson()
		filesByType[FileType.json] = json
		defaultResult = json.defaultResult
	}

	if (defaultResult) {
		let file
		let { url } = defaultResult
		if (isZipUrl(url)) {
			file = tableFiles.find(f => url.includes(f.name))
			const options = {
				name: file.name,
				type: 'text/csv',
			}
			file = createBaseFile(file, options)
			url = await file.toDataURL()
		}

		filesByType['results'] = {
			file,
			dataUri: url,
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

	const tables: BaseFile[] = tableFiles.filter(file => !isResult(file.name))
	if (tables.length > 0) {
		filesByType['tables'] = tables
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
