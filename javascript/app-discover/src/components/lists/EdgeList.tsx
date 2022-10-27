/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, Label } from '@fluentui/react'
import { memo } from 'react'

import {
	useOnFlip,
	useOnPin,
	useOnRemove,
	useOnRenderItem,
} from './EdgeList.hooks.js'
import type { EdgeListProps } from './EdgeList.types.js'
import { groupByEffectType } from './EdgeList.utils.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
	constraints,
	onUpdateConstraints,
}) {
	const groupedList = groupByEffectType(relationships, variable.columnName)

	const onPin = useOnPin(constraints, onUpdateConstraints)
	const onRemove = useOnRemove(constraints, onUpdateConstraints)
	const onFlip = useOnFlip(constraints, onUpdateConstraints)

	const renderItem = useOnRenderItem(
		onSelect,
		onFlip,
		onPin,
		onRemove,
		variable,
		constraints,
	)

	return (
		<FocusZone>
			{Object.keys(groupedList).map(groupName => {
				return (
					<div key={groupName}>
						<Label>{groupName}</Label>
						{groupedList[groupName].map(r => renderItem(r))}
					</div>
				)
			})}
		</FocusZone>
	)
})
