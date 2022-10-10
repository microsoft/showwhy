/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { DownloadType } from '../types/files/DownloadType.js'
import { createCSVBlob, download } from '../utils/download.js'
import { useEstimateData } from './estimate/useEstimateData.js'

export function useDownloadEstimateData(): () => void {
	const estimateData = useEstimateData()
	return useCallback(() => {
		if (!estimateData) return
		const blob = createCSVBlob(estimateData)
		download(DownloadType.csv, 'text/csv', blob)
	}, [estimateData])
}
