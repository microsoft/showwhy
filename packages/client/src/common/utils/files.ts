/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	FileType,
	BaseFile,
} from '@data-wrangling-components/utilities'
import { ProjectFile, ZipData } from '~interfaces'

export function createTextFile(name: string, content: string): File {
	const type = { type: `text/${name.split('.')[1]}` }
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

export const groupFilesByType = async (
	fileCollection: FileCollection,
): Promise<ZipData> => {
	const filesByType = {
		name: fileCollection.name || 'FileCollection',
	}
	const resultsRegExp = /result(.+).(c|t)sv/gi
	const isResult = filename => resultsRegExp.test(filename)
	const tableFiles: BaseFile[] = fileCollection.list(FileType.table)

	const [jsonFile] = fileCollection.list(FileType.json)
	if (jsonFile) {
		filesByType[FileType.json] = await jsonFile.toJson()
	}

	//TODO: It gets the first coincidence, should it be an array instead?
	const result = tableFiles.find(file => isResult(file.name))
	if (result) {
		filesByType['results'] = {
			entry: result,
			dataUri: await result.toDataURL(),
		}
	}

	const tables: BaseFile[] = tableFiles.filter(file => !isResult(file.name))
	if (tables.length > 0) {
		filesByType['tables'] = tables
	}

	return filesByType
}
