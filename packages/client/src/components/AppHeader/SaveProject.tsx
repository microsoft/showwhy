/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { IContextualMenuProps } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'
import { OptionsButton } from './OptionsButton'
import {
	useDefaultRun,
	useDownloadResult,
	useIsCollectionEmpty,
	useSaveProject,
} from '~hooks'
import { Container } from '~styles'
import { FileType, NodeResponseStatus } from '~types'

export const SaveProject: React.FC = memo(function SaveProject() {
	const downloadResult = useDownloadResult()
	const defaultRun = useDefaultRun()
	const isCollectionEmpty = useIsCollectionEmpty()
	const saveProject = useSaveProject()

	const onDownload = useCallback(
		(type: FileType) => {
			downloadResult(type)
		},
		[downloadResult],
	)

	const saveProps = useMemo((): IContextualMenuProps => {
		const disabled =
			!defaultRun || defaultRun?.status?.status !== NodeResponseStatus.Completed
		return {
			items: [
				{
					key: 'project',
					text: 'Project',
					disabled: isCollectionEmpty,
					onClick: saveProject,
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
					disabled,
					onClick: () => onDownload(FileType.jupyter),
				},
				{
					key: 'csv',
					text: 'Result CSV',
					disabled,
					onClick: () => onDownload(FileType.csv),
				},
			],
		}
	}, [defaultRun, onDownload, saveProject, isCollectionEmpty])

	return (
		<Container>
			<OptionsButton text="Save" menuProps={saveProps} />
		</Container>
	)
})
