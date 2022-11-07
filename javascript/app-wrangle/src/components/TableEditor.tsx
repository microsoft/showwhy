/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	DisplayOrder,
	StepList,
	TableCommands,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
	useWorkflowInputTableNames,
} from '@datashaper/react'
import { ToolPanel } from '@essex/components'
import { CommandBar } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDataTableOutput } from '@showwhy/app-common'
import { useObservableState } from 'observable-hooks'
import { memo, useMemo, useState } from 'react'

import {
	useColumnState,
	useHistoryButtonCommandBar,
	useSelectedTable,
	useStepListener,
	useTableName,
} from './TableEditor.hooks.js'
import {
	Container,
	DetailsListContainer,
	useTableCommandProps,
	useTableHeaderColors,
	useTableHeaderStyles,
	useToolPanelStyles,
} from './TableEditor.styles.js'
import type { TableEditorProps } from './TableEditor.types.js'

export const TableEditor: React.FC<TableEditorProps> = memo(
	function TableEditor({ dataTable }) {
		// Primary State
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const table = useDataTableOutput(dataTable)
		const workflow = dataTable.workflow
		const [selectedId, setSelectedId] = useState<string | undefined>(table?.id)
		const [selectedColumn, onColumnClick] = useColumnState()

		// Derived State
		const inputNames = useWorkflowInputTableNames(workflow)
		const numSteps = useObservableState(workflow.length$, workflow.length)
		const toolPanelHeader = useMemo(
			() => `Workflow steps (${numSteps})`,
			[numSteps],
		)
		const tableName = useTableName(dataTable, selectedId)
		const selectedTable = useSelectedTable(dataTable, selectedId)
		const historyButtonCommandBar = useHistoryButtonCommandBar(
			isCollapsed,
			numSteps,
			toggleCollapsed,
		)
		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const tableCommandProps = useTableCommandProps()
		const toolPanelStyles = useToolPanelStyles()

		// Event Handlers
		const onSave = useOnSaveStep(workflow)
		const onCreate = useOnCreateStep(onSave, setSelectedId)
		const onDelete = useOnDeleteStep(workflow)

		// Side Effects
		useStepListener(workflow, setSelectedId, inputNames)

		return selectedTable?.table == null ? null : (
			<Container collapsed={isCollapsed}>
				<DetailsListContainer>
					<ArqueroTableHeader
						background={tableHeaderColors.background}
						styles={tableHeaderStyles}
						commandBar={
							<TableCommands
								{...tableCommandProps}
								workflow={workflow}
								selectedColumn={selectedColumn}
								onAddStep={onCreate}
								onRemoveStep={onDelete}
							/>
						}
						farCommandBar={<CommandBar {...historyButtonCommandBar} />}
						name={tableName}
						table={selectedTable.table}
					/>
					<ArqueroDetailsList
						compact
						sortable
						showColumnBorders
						isHeaderFixed
						fill
						clickableColumns
						selectedColumn={selectedColumn}
						metadata={selectedTable.metadata}
						table={selectedTable?.table}
						onColumnClick={onColumnClick}
						onColumnHeaderClick={onColumnClick}
					/>
				</DetailsListContainer>
				<ToolPanel
					headerText={toolPanelHeader}
					onDismiss={toggleCollapsed}
					headerIconProps={HISTORY_ICON_PROPS}
					styles={toolPanelStyles}
				>
					<StepList
						order={DisplayOrder.LastOnTop}
						selectedKey={selectedId}
						workflow={workflow}
						onSave={onSave}
						onDelete={onDelete}
						onSelect={setSelectedId}
					/>
				</ToolPanel>
			</Container>
		)
	},
)

const HISTORY_ICON_PROPS = {
	iconName: 'History',
}
