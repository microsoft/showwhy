/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	ArqueroDetailsList,
	ArqueroTableHeader,
	StepHistoryList,
	TableCommands,
	useOnCreateStep,
	useOnDeleteStep,
	useOnSaveStep,
} from '@datashaper/react'
import { useInputTableNames } from '@datashaper/react/dist/hooks/useTableDropdownOptions.js'
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
		const [isCollapsed, { toggle: toggleCollapsed }] = useBoolean(true)
		const table = useDataTableOutput(dataTable)
		const workflow = dataTable.workflow
		const [selectedId, setSelectedId] = useState<string | undefined>(table?.id)
		const [selectedColumn, onColumnClick] = useColumnState()

		const inputNames = useInputTableNames(workflow)
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

		const onSave = useOnSaveStep(workflow)
		const onCreate = useOnCreateStep(onSave, setSelectedId)
		const onDelete = useOnDeleteStep(workflow)

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
								onAddStep={onCreate}
								selectedColumn={selectedColumn}
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
						onColumnHeaderClick={onColumnClick}
						clickableColumns={!!onColumnClick}
						selectedColumn={selectedColumn}
						onColumnClick={onColumnClick}
						metadata={selectedTable.metadata}
						table={selectedTable?.table}
					/>
				</DetailsListContainer>
				<ToolPanel
					headerText={toolPanelHeader}
					onDismiss={toggleCollapsed}
					headerIconProps={HISTORY_ICON_PROPS}
					styles={toolPanelStyles}
				>
					<StepHistoryList
						onDelete={onDelete}
						onSelect={setSelectedId}
						selectedKey={selectedId}
						workflow={workflow}
						onSave={onSave}
					/>
				</ToolPanel>
			</Container>
		)
	},
)

const HISTORY_ICON_PROPS = {
	iconName: 'History',
}
