/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepInput, Workflow } from '@datashaper/core'
import { nextColumnName } from '@datashaper/core'
import type { IContextualMenuItem } from '@fluentui/react'
import type { Handler1, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import { useOutputTable } from '~hooks'

export function useOnAssignAllSubjects(
	workflow: Workflow,
	setWorkflow: Handler1<Workflow>,
	setSelectedTableId: Handler1<string>,
	onSelectVariable: (
		option: Maybe<IContextualMenuItem>,
		columnName: string,
	) => void,
	selectedTableId: Maybe<string>,
): (definitionName: string, definitionId: string) => void {
	const outputTable = useOutputTable()
	return useCallback(
		(definitionName: string, definitionId: string) => {
			const tableName = definitionName.split(' ').join('_')
			if (workflow && !workflow.hasOutput(tableName)) {
				const clonedWorkflow = workflow.clone()

				let input = workflow.steps[workflow.steps.length - 1]?.id
				if (!input && selectedTableId) {
					input = selectedTableId
					clonedWorkflow.addInput(input)
				}
				const existingColumns = outputTable?.columnNames() || []
				const columnName = nextColumnName(
					'all_subjects_population',
					existingColumns,
				)

				const step = {
					id: tableName,
					args: {
						to: columnName,
						value: 1,
					},
					verb: 'fill',
					input: {
						source: {
							node: input,
						},
					},
				} as StepInput
				clonedWorkflow.addStep(step)
				clonedWorkflow.addOutput({
					name: tableName,
					node: tableName,
				})
				setWorkflow(clonedWorkflow)
				setSelectedTableId(tableName)
				const option = { key: definitionId } as IContextualMenuItem
				onSelectVariable(option, columnName)
			}
		},
		[
			workflow,
			setWorkflow,
			setSelectedTableId,
			onSelectVariable,
			selectedTableId,
			outputTable,
		],
	)
}
