/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FileType } from '@data-wrangling-components/utilities'
import type { Maybe } from '@showwhy/types'
import { DownloadType } from '@showwhy/types'

import { api } from '~resources'

export function downloadResult(fileType: FileType): void {
	const fileName =
		fileType === FileType.csv ? DownloadType.csv : DownloadType.jupyter
	api.downloadFile(fileName).then(res => {
		if (!res) return
		const file = window.URL.createObjectURL(res.blob)
		const anchor = document.createElement('a')
		anchor.download = fileName
		anchor.href = file
		anchor.click()
	})
}

export async function getResult(type = DownloadType.csv): Promise<Maybe<Blob>> {
	const result = await api.downloadFile(type)
	if (!result) return
	return result.blob
}
