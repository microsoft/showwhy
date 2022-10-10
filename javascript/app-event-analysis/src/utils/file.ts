/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
type FileType = 'application/json' | 'text/plain'

export const readFileAsText = async (file: File) => {
	const promise: Promise<string> = new Promise(resolve => {
		const r = new FileReader()
		r.readAsText(file)
		r.onload = e => {
			const contents = e?.target?.result || ''
			resolve(contents as string)
		}
	})
	return promise
}

export const saveAsFile = (
	fileName: string,
	content: string,
	fileType: FileType,
) => {
	const blob = new Blob([content], { type: fileType })
	const url = URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.style.display = 'none'
	a.href = url
	a.download = fileName
	document.body.appendChild(a)
	a.click()
	URL.revokeObjectURL(url)
}
