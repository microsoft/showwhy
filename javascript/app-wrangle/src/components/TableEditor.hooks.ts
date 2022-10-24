/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHeaderCommandBarDefaults } from '@datashaper/react'
import type { Workflow } from '@datashaper/workflow'
import type { ICommandBarItemProps, ICommandBarProps } from '@fluentui/react'
import { useEffect, useMemo } from 'react'

import { buttonStyles, icons } from './TableEditor.styles.js'

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
	workflow: Workflow,
	toggleCollapsed: () => void,
): ICommandBarProps {
	const base = useMemo(
		() => ({
			items: [
				{
					key: 'historyButton',
					id: 'historyButton',
					disabled: !isCollapsed,
					text: `(${workflow.steps.length.toString() ?? '0'})`,
					iconProps: icons.history,
					onClick: toggleCollapsed,
					buttonStyles,
				} as ICommandBarItemProps,
			],
			id: 'historyButton',
		}),
		[isCollapsed, workflow, toggleCollapsed],
	)
	return useHeaderCommandBarDefaults(base, true)
}
