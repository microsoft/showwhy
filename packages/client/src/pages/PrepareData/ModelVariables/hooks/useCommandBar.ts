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
					iconProps: {
						//TODO: change icon props to new style on Chris's pR
						iconName: 'CheckMark',
					},
				},
				{
					key: 'duplicateItem',
					text: 'Duplicate',
					iconOnly: true,
					iconProps: { iconName: 'DuplicateRow' },
				},
				{
					key: 'addItem',
					text: 'Add from this column',
					iconOnly: true,
					iconProps: { iconName: 'Add' },
				},
			]
			return createDefaultCommandBar(items)
		},
		[definitionOptions, selectedDefinitionId, setTargetVariable],
	)
}
