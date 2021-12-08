/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { DownloadType, FileType } from '~enums'
import { downloadFile } from '~resources'

export function useReturnResult(): (
	sessionId: string,
	fileName: string,
) => Promise<{ blob: Blob; url: string } | undefined> {
	return useCallback(
		(sessionId, fileName) => downloadFile(sessionId, fileName),
		[],
	)
}

export function useDownloadResult(): (
	sessionId: string,
	fileType: FileType,
) => void {
	const getResult = useReturnResult()
	return useCallback(
		(sessionId: string, fileType: FileType) => {
			const fileName =
				fileType === FileType.csv ? DownloadType.csv : DownloadType.jupyter
			getResult(sessionId, fileName).then(res => {
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
