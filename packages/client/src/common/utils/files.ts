/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import * as zip from '@zip.js/zip.js'
import { FileType } from '~enums'
import { ProjectFile, ZipData } from '~interfaces'

import { GenericObject } from '~types'

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

export function extension(filename = ''): string {
	const parts = filename.split('.')
	const ext = parts.pop()
	if (!ext) {
		throw Error('Error retrieving file extension')
	}
	return ext
}

export function guessDelimiter(filename: string): string {
	const ext = extension(filename)
	switch (ext) {
		case 'tsv':
		case 'txt':
			return '\t'
		default:
			return ','
	}
}

export function isZipUrl(url: string): boolean {
	return url.toLowerCase().startsWith(FileType.zip)
}

export function isZipFile(url: string): boolean {
	return url.toLowerCase().endsWith(FileType.zip)
}

export const getJsonFileContent = async (
	jsonEntry: zip.Entry,
): Promise<GenericObject> => {
	const writer = new zip.TextWriter() || {}
	const data = jsonEntry.getData ? await jsonEntry.getData(writer) : ''
	const json = JSON.parse(data.toString())
	return json
}

export const groupFilesByType = async (
	entries: zip.Entry[],
	name = 'Zip Files',
): Promise<ZipData> => {
	const filesByType = { name }
	const resultsRegExp = /result(.+).(c|t)sv/gi
	const isResult = filename => resultsRegExp.test(filename)

	const jsonFile = entries.find(entry => entry.filename.includes(FileType.json))
	if (jsonFile) {
		filesByType[FileType.json] = jsonFile
	}

	//TODO: It gets the first coincidence, should it be an array instead?
	const results = entries.find(entry => isResult(entry.filename))
	if (results) {
		const blob = await getBlobFromEntry(results)
		const url = await blobToDataURL(blob)
		filesByType['results'] = {
			entry: results,
			dataUri: url,
		}
	}

	const tables = entries.filter(
		entry =>
			!isResult(entry.filename) &&
			(entry.filename.includes(FileType.csv) ||
				entry.filename.includes(FileType.tsv)),
	)
	if (tables.length > 0) {
		filesByType['tables'] = tables
	}

	return filesByType
}

//**blob to dataURL**
export async function blobToDataURL(blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsDataURL(blob)
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = e => reject(e)
	})
}

export async function getBlobFromEntry(entry: zip.Entry): Promise<Blob> {
	const writer = new zip.BlobWriter()
	const blob = entry.getData ? await entry.getData(writer) : new Blob()
	return blob
}

export async function getFileFromEntry(entry: zip.Entry): Promise<File> {
	const blob = await getBlobFromEntry(entry)
	return new File([blob], entry.filename.split('/').pop() || '')
}

export async function getFilesFromEntries(entries: zip.Entry[] = []) {
	return Promise.all(entries.map(entry => getFileFromEntry(entry)))
}

export async function getTextFromFile(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader()
		reader.readAsText(file)
		reader.onload = () => {
			resolve(reader.result as string)
		}
		reader.onerror = e => reject(e)
	})
}
