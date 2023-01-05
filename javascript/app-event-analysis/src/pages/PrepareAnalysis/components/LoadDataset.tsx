/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTableBundles } from '@datashaper/app-framework'
import { Link } from '@fluentui/react'
import { TableMenuBar } from '@showwhy/app-common'
import { not } from 'arquero'
import React, { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import {
	useCurrentFileNameState,
	useFileNameState,
} from '../../../state/index.js'
import { StepDescription, StepTitle } from '../../../styles/index.js'
import { useHandleFileLoad } from '../PrepareAnalysis.hooks.js'
import { SectionContainer } from '../PrepareAnalysis.styles.js'

export const LoadDataset: React.FC = memo(function LoadDataset() {
	const [fileName, setFileName] = useFileNameState()
	const [currentTableName, setCurrentTableName] = useCurrentFileNameState()
	const handleFileLoad = useHandleFileLoad()
	const dataTables = useTableBundles()

	const onDatasetClicked = useCallback(
		(name: string) => {
			const table = dataTables.find(d => d.name === name)?.output?.table
			if (table) {
				setCurrentTableName(name)
				setFileName(name)
				// @FIXME: ideally we should consume the wrangled data-table as is
				//  and not convert it back to CSV before reading its content
				const tableAsCSV = table?.select(not('index')).toCSV()
				handleFileLoad({ fileName: name, content: tableAsCSV })
			}
		},
		[dataTables, handleFileLoad, setCurrentTableName, setFileName],
	)

	const onDataTablesUpdate = useCallback(() => {
		if (fileName !== currentTableName) {
			onDatasetClicked(fileName)
		}
	}, [fileName, currentTableName, onDatasetClicked])

	useEffect(() => {
		onDataTablesUpdate()
	}, [dataTables])

	return (
		<SectionContainer>
			<StepTitle>Load your data set</StepTitle>
			<StepDescription>
				Load a dataset in&nbsp;
				<Link href="https://en.wikipedia.org/wiki/Panel_data" target="_blank">
					panel data format
				</Link>
				&nbsp;to get started.
			</StepDescription>
			<MenuContainer>
				<TableMenuBar
					selectedTable={fileName}
					onTableSelected={onDatasetClicked}
				/>
			</MenuContainer>
		</SectionContainer>
	)
})

const MenuContainer = styled.div`
	width: 35%;
`
