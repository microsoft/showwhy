/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps } from '@fluentui/react'
import React, { memo, useCallback, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import { FileType, NodeResponseStatus } from '~enums'

import { useDefaultRun, useDownloadResult } from '~hooks'
import { Container } from '~styles'

export const SaveProject: React.FC = memo(function SaveProject() {
	const downloadResult = useDownloadResult()
	const defaultRun = useDefaultRun()

	const onDownload = useCallback(
		(type: FileType) => {
			downloadResult(defaultRun?.sessionId || '', type)
		},
		[defaultRun, downloadResult],
	)

	const saveProps = useMemo((): IContextualMenuProps => {
		return {
			items: [
				{
					key: 'project',
					text: 'Project',
					disabled: true,
				},
				{
					key: 'data',
					text: 'Data',
					disabled: true,
				},
				{
					key: 'report',
					text: 'Report',
					disabled: true,
				},
				{
					key: 'jupyter',
					text: 'Jupyter Notebook',
					disabled:
						!defaultRun ||
						defaultRun?.status?.status !== NodeResponseStatus.Completed,
					onClick: () => onDownload(FileType.jupyter),
				},
				{
					key: 'csv',
					text: 'Result CSV',
					disabled:
						!defaultRun ||
						defaultRun?.status?.status !== NodeResponseStatus.Completed,
					onClick: () => onDownload(FileType.csv),
				},
			],
		}
	}, [defaultRun, onDownload])

	return (
		<Container>
			<OptionsButton text="Save" menuProps={saveProps} />
		</Container>
	)
})
