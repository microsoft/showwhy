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
	useWorkflowOutputListener,
} from '@datashaper/react'
import { useInputTableNames } from '@datashaper/react/dist/hooks/useTableDropdownOptions.js'
import type { TableContainer } from '@datashaper/tables'
import { ToolPanel } from '@essex/components'
import { type IColumn, CommandBar } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { useDataTableOutput } from '@showwhy/app-common'
import upperFirst from 'lodash-es/upperFirst.js'
import { useObservableState } from 'observable-hooks'
import { memo, useCallback, useMemo, useState } from 'react'
import { map } from 'rxjs'

import {
	useHistoryButtonCommandBar,
	useStepListener,
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
		const [selectedTableId, setSelectedTableId] = useState<string | undefined>(
			table?.id,
		)
		const [outputs, setOutputs] = useState<TableContainer[]>([])
		const [selectedColumn, setSelectedColumn] = useState<string | undefined>()

		const onSave = useOnSaveStep(workflow)
		const onCreate = useOnCreateStep(onSave, setSelectedTableId)
		const onDelete = useOnDeleteStep(workflow)
		const inputNames = useInputTableNames(workflow)
		const numSteps = useObservableState(
			workflow.steps$.pipe(map(steps => steps.length)),
		)

		const tableName = useMemo(() => {
			let name: string | null = null
			const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
			// if the step index is the final step, use the default datatable name
			if (stepIndex < workflow.steps.length - 1) {
				name = upperFirst(workflow.steps[stepIndex]?.verb)
			}
			return name || dataTable.name
		}, [workflow, selectedTableId, dataTable.name])

		const selectedTable = useMemo((): TableContainer | undefined => {
			return (
				(table ? [table] : [])
					.concat(outputs)
					.find(x => x.id === selectedTableId) ?? table
			)
		}, [table, selectedTableId, outputs])

		useStepListener(workflow, setSelectedTableId, inputNames)
		useWorkflowOutputListener(workflow, setOutputs)

		const onColumnClick = useCallback(
			(_?: React.MouseEvent<HTMLElement, MouseEvent>, column?: IColumn) => {
				setSelectedColumn(column?.name)
			},
			[setSelectedColumn],
		)

		const historyButtonCommandBar = useHistoryButtonCommandBar(
			isCollapsed,
			numSteps,
			toggleCollapsed,
		)

		const tableHeaderColors = useTableHeaderColors()
		const tableHeaderStyles = useTableHeaderStyles()
		const tableCommandProps = useTableCommandProps()
		const toolPanelStyles = useToolPanelStyles()
		console.log('selected table', dataTable, table, tableName, selectedTableId)
		return selectedTable?.table == null ? null : (
			<Container isCollapsed={isCollapsed}>
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
						clickableColumns={!!onColumnClick}
						selectedColumn={selectedColumn}
						onColumnClick={onColumnClick}
						metadata={selectedTable.metadata}
						table={selectedTable?.table}
					/>
				</DetailsListContainer>
				<ToolPanel
					headerText={`Workflow steps (${workflow.steps.length})`}
					onDismiss={toggleCollapsed}
					headerIconProps={{
						iconName: 'History',
					}}
					styles={toolPanelStyles}
				>
					<StepHistoryList
						onDelete={onDelete}
						onSelect={setSelectedTableId}
						workflow={workflow}
						onSave={onSave}
					/>
				</ToolPanel>
			</Container>
		)
	},
)
