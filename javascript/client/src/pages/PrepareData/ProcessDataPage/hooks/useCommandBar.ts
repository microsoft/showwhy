/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createDefaultCommandBar } from '@data-wrangling-components/react'
import type {
	IDetailsColumnProps,
	ICommandBarItemProps,
	ICommandBarProps,
} from '@fluentui/react'
import { useCallback } from 'react'
import type { FactorsOrDefinitions } from '~types'

export function useCommandBar(
	renderDropdown: (columnName: string) => JSX.Element,
	onResetVariable: (columnName: string) => void,
	allElements: FactorsOrDefinitions,
): () => JSX.Element {
	return useCallback(
		(props?: IDetailsColumnProps) => {
			const columnName = props?.column.name ?? ''
			const items: ICommandBarItemProps[] = [
				{
					key: 'definition',
					iconOnly: true,
					onRender: () => renderDropdown(columnName),
				},
				{
					key: 'reset',
					text: 'Reset selection',
					iconOnly: true,
					iconProps: iconProps.reset,
					onClick: () => onResetVariable(columnName),
					disabled: !allElements.find(x => x.column === columnName),
				},
			]
			return createDefaultCommandBar(items, {
				style: { width: 250 },
			} as ICommandBarProps)
		},
		[renderDropdown, onResetVariable, allElements],
	)
}

const iconProps = {
	reset: { iconName: 'RemoveLink' },
}
