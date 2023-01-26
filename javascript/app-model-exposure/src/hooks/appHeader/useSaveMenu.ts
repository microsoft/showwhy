/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuProps } from '@fluentui/react'
import { useMemo } from 'react'

import { isStatus } from '../../api-client/utils.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import { DownloadType } from '../../types/files/DownloadType.js'
import type { Maybe } from '../../types/primitives.js'
import { download } from '../../utils/download.js'
import { useDefaultRun } from '../runHistory.js'
import { useDownloadEstimateData } from '../useDownloadEstimateData.js'
import { useGetNotebookData } from '../useGetNotebookData.js'

export function useSaveMenu(): IContextualMenuProps {
	const defaultRun = useDefaultRun()
	const downloadCSV = useDownloadEstimateData()
	const notebookData = useGetNotebookData()
	return useMemo<IContextualMenuProps>(() => {
		const disabled = !(
			defaultRun && isStatus(defaultRun?.status, NodeResponseStatus.Success)
		)

		return {
			items: [
				{
					key: 'jupyter',
					text: 'Jupyter Notebook',
					disabled,
					onClick: () => downloadNotebook(notebookData()),
					'data-pw': 'save-jupyter',
				},
				{
					key: 'csv',
					text: 'Result CSV',
					disabled,
					onClick: downloadCSV,
					'data-pw': 'save-csv',
				},
			],
		}
	}, [downloadCSV, notebookData, defaultRun])
}

async function downloadNotebook(notebookData: Promise<Maybe<Blob>>) {
	const data = await notebookData
	if (!data) return
	download(DownloadType.jupyter, 'text/csv', data)
}
