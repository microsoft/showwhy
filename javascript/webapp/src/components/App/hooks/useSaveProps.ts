/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IContextualMenuProps } from '@fluentui/react'
import { NodeResponseStatus } from '@showwhy/types'
import { useMemo } from 'react'

import { useDefaultRun, useIsCollectionEmpty } from '~hooks'
import { FileType } from '~types'

import { downloadResult } from '../App.util'
import { useSaveProject } from './useSaveProject'

export function useSaveProps(): IContextualMenuProps {
	const defaultRun = useDefaultRun()
	const isCollectionEmpty = useIsCollectionEmpty()
	const saveProject = useSaveProject()

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
					onClick: () => downloadResult(FileType.jupyter),
					'data-pw': 'save-jupyter',
				},
				{
					key: 'csv',
					text: 'Result CSV',
					disabled,
					onClick: () => downloadResult(FileType.csv),
					'data-pw': 'save-csv',
				},
			],
		}
	}, [defaultRun, saveProject, isCollectionEmpty])
}
