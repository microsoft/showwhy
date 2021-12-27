/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ProjectFile } from '~interfaces'

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
