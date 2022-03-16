/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { createDefaultCommandBar } from '@data-wrangling-components/react'
import type {
	ICommandBarItemProps,
	ICommandBarProps,
	IDetailsColumnProps,
} from '@fluentui/react'
import { useCallback } from 'react'

export function useCommandBar(
	renderDropdown: (columnName: string) => JSX.Element,
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
			]
			return createDefaultCommandBar(items, {
				style: { width: 200 },
			} as ICommandBarProps)
		},
		[renderDropdown],
	)
}
