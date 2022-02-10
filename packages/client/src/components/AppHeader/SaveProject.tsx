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
	const saveProps = useSaveProps()

	return (
		<Container data-pw="save">
			<OptionsButton text="Save" menuProps={saveProps} />
		</Container>
	)
})

function useSaveProps(): IContextualMenuProps {
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

	return useMemo<IContextualMenuProps>(() => {
		const disabled =
			!defaultRun || defaultRun?.status?.status !== NodeResponseStatus.Completed
		return {
			items: [
				{
					key: 'project',
					text: 'Project',
					disabled: isCollectionEmpty,
					onClick: saveProject,
					'data-pw': 'save-project',
				},
				{
					key: 'data',
					text: 'Data',
					disabled: true,
					'data-pw': 'save-data',
				},
				{
					key: 'report',
					text: 'Report',
					disabled: true,
					'data-pw': 'save-report',
				},
				{
					key: 'jupyter',
					text: 'Jupyter Notebook',
					disabled,
					onClick: () => onDownload(FileType.jupyter),
					'data-pw': 'save-jupyter',
				},
				{
					key: 'csv',
					text: 'Result CSV',
					disabled,
					onClick: () => onDownload(FileType.csv),
					'data-pw': 'save-csv',
				},
			],
		}
	}, [defaultRun, onDownload, saveProject, isCollectionEmpty])
}
