/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Checkbox, List } from '@fluentui/react'
import { memo, useCallback, useMemo } from 'react'

import { ListContainer } from './CheckboxList.styles.js'
import type { CheckboxListProps, RenderItem } from './CheckboxList.types.js'

export const CheckboxList: React.FC<CheckboxListProps> = memo(
	function CheckboxList({ items, selection, onSelectionChange, height = 200 }) {
		//
		const onItemChecked = useCallback(
			(itemName: string, isChecked: boolean) => {
				const newSelection = new Set(selection)
				isChecked ? newSelection.add(itemName) : newSelection.delete(itemName)
				onSelectionChange(newSelection)
			},
			[onSelectionChange, selection],
		)

		const uiItems = useMemo(() => {
			return items.map(item => ({
				name: item.name,
				checked: selection.has(item.name),
			})) as RenderItem[]
		}, [items, selection])

		const onRenderCell = useCallback(
			(item?: RenderItem) => {
				const itemName = item?.name ?? ''
				const isChecked = item?.checked ?? false
				return (
					<div key={itemName} data-is-focusable>
						<div className="itemContent">
							<Checkbox
								label={itemName}
								checked={isChecked}
								onChange={(e, checked) => onItemChecked(itemName, !!checked)}
							/>
						</div>
					</div>
				)
			},
			[onItemChecked],
		)

		return (
			<ListContainer height={height} data-is-scrollable>
				<List items={uiItems} onRenderCell={onRenderCell} />
			</ListContainer>
		)
	},
)
