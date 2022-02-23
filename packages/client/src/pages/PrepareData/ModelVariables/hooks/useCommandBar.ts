/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createDefaultCommandBar } from '@data-wrangling-components/react'
import {
	ICommandBarItemProps,
	IRenderFunction,
	IDetailsColumnProps,
} from '@fluentui/react'
import { useCallback } from 'react'
import { FactorsOrDefinitions } from '~types'

export function useCommandBar(
	definitionOptions: FactorsOrDefinitions,
	selectedDefinitionId: string,
	setTargetVariable: (actualColumn: string) => void,
	onDuplicateStep: (actualColumn: string) => void,
): IRenderFunction<IDetailsColumnProps> {
	return useCallback(
		(props?: IDetailsColumnProps) => {
			const selectedColumn = definitionOptions.find(
				x => x.id === selectedDefinitionId,
			)?.column
			const actualColumn = props?.column.name as string
			const items: ICommandBarItemProps[] = [
				{
					key: 'assignItem',
					text: 'Assign',
					iconOnly: true,
					buttonStyles: { root: { fontWeight: 'bold' } },
					onClick: () => setTargetVariable(actualColumn),
					checked: selectedColumn === actualColumn,
					iconProps: iconProps.check,
				},
				{
					key: 'duplicateItem',
					text: 'Duplicate',
					iconOnly: true,
					iconProps: iconProps.duplicate,
					onClick: () => onDuplicateStep(actualColumn),
				},
				{
					key: 'addItem',
					text: 'Add from this column',
					iconOnly: true,
					iconProps: iconProps.add,
				},
			]
			return createDefaultCommandBar(items)
		},
		[
			definitionOptions,
			selectedDefinitionId,
			setTargetVariable,
			onDuplicateStep,
		],
	)
}

const iconProps = {
	check: { iconName: 'CheckMark' },
	duplicate: { iconName: 'DuplicateRow' },
	add: { iconName: 'Add' },
}
