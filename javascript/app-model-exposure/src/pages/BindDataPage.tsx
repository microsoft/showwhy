/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ArqueroDetailsList, ArqueroTableHeader } from '@datashaper/react'
import { TableMenuBar } from '@showwhy/app-common'
import type { FC } from 'react'
import { memo } from 'react'

import { AddVariableFields } from '../components/AddVariableFields.js'
import { CompletedElements } from '../components/CompletedElements.js'
import { DataTypeWarningMessage } from '../components/DataTypeWarningMessage.js'
import { useBindData } from '../hooks/bindData/useBindData.js'
import { useGetElements } from '../hooks/bindData/useGetElements.js'
import { useCommandBar } from './BindDataPage.hooks.js'
import {
	ActionsContainer,
	Container,
	PrepareDataContainer,
} from './BindDataPage.styles.js'

export const BindDataPage: FC = memo(function BindDataPage() {
	const commandBar = useCommandBar()

	const { tables, onSelectTableId, selectedTableName, selectedTable } =
		useBindData()

	const {
		completedElements,
		allElements,
		onResetVariable,
		subjectIdentifier,
		onSetSubjectIdentifier,
		onAssignAllSubjects,
	} = useGetElements()

	return (
		<Container>
			<DataTypeWarningMessage />
			<ActionsContainer>
				<TableMenuBar
					selectedTable={selectedTableName}
					onTableSelected={onSelectTableId}
				/>
				<AddVariableFields />
				{allElements.length > 0 && (
					<CompletedElements
						onAssignAllSubjects={onAssignAllSubjects}
						completedElements={completedElements}
						allElements={allElements}
						onResetVariable={onResetVariable}
						subjectIdentifier={subjectIdentifier}
						onSetSubjectIdentifier={onSetSubjectIdentifier}
					/>
				)}
			</ActionsContainer>

			<PrepareDataContainer>
				{selectedTable?.table ? (
					<>
						<ArqueroTableHeader
							name={selectedTableName}
							table={selectedTable?.table}
						/>
						<ArqueroDetailsList
							sortable
							compact
							features={{ commandBar: [commandBar] }}
							showColumnBorders
							isHeaderFixed
							metadata={selectedTable?.metadata}
							table={selectedTable?.table}
						/>
					</>
				) : (
					<div>Select a table to view data...</div>
				)}
			</PrepareDataContainer>
		</Container>
	)
})
