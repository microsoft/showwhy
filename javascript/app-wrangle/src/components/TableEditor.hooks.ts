/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataTable } from '@datashaper/workflow'
import { useHeaderCommandBarDefaults } from '@datashaper/react'
import type { Workflow } from '@datashaper/workflow'
import type { ICommandBarItemProps, ICommandBarProps } from '@fluentui/react'
import { useEffect, useMemo } from 'react'
import upperFirst from 'lodash-es/upperFirst.js'

import {
	buttonStyles,
	icons,
	useTableHeaderColors,
} from './TableEditor.styles.js'

export function useTableName(
	dataTable: DataTable,
	selectedTableId: string | undefined,
): string {
	const { workflow } = dataTable
	return useMemo(() => {
		let name: string | null = null
		const stepIndex = workflow.steps.findIndex(x => x.id === selectedTableId)
		// if the step index is the final step, use the default datatable name
		if (stepIndex < workflow.steps.length - 1) {
			name = `#${stepIndex}: ${upperFirst(workflow.steps[stepIndex]?.verb)}`
		}
		return name || dataTable.name
	}, [workflow, selectedTableId, dataTable.name])
}

export function useStepListener(
	workflow: Workflow,
	setSelectedTableId: (tableId: string) => void,
	inputNames: string[],
): void {
	useEffect(() => {
		if (workflow.steps.length > 0) {
			const { id } = workflow.steps[workflow.steps.length - 1]
			setSelectedTableId(id)
		} else {
			if (workflow.inputNames.length > 0) {
				const lastInputName = inputNames[workflow.inputNames.length - 1]
				if (lastInputName) {
					setSelectedTableId(lastInputName)
				}
			}
		}
	}, [workflow, inputNames, setSelectedTableId])
}

export function useHistoryButtonCommandBar(
	isCollapsed: boolean,
	numSteps: number | undefined,
	toggleCollapsed: () => void,
): ICommandBarProps {
	const base = useMemo(
		() => ({
			items: [
				{
					key: 'historyButton',
					id: 'historyButton',
					disabled: !isCollapsed,
					text: `(${numSteps ?? '0'})`,
					iconProps: icons.history,
					onClick: toggleCollapsed,
					buttonStyles,
				} as ICommandBarItemProps,
			],
			id: 'historyButton',
			styles: {
				root: {
					height: 43,
				},
			},
		}),
		[isCollapsed, numSteps, toggleCollapsed],
	)
	const colors = useTableHeaderColors()
	return useHeaderCommandBarDefaults(base, true, colors)
}
