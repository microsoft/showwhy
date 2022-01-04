/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { DownloadType, FileType } from '~enums'
import { downloadFile } from '~resources'

export function useReturnResult(): (
	fileName: string,
) => Promise<{ blob: Blob; url: string } | undefined> {
	return useCallback(fileName => downloadFile(fileName), [])
}

export function useDownloadResult(): (fileType: FileType) => void {
	const getResult = useReturnResult()
	return useCallback(
		(fileType: FileType) => {
			const fileName =
				fileType === FileType.csv ? DownloadType.csv : DownloadType.jupyter
			getResult(fileName).then(res => {
				if (!res) return
				const file = window.URL.createObjectURL(res.blob)
				const anchor = document.createElement('a')
				anchor.download = fileName
				anchor.href = file
				anchor.click()
			})
		},
		[getResult],
	)
}
