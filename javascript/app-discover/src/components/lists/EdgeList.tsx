/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, Label } from '@fluentui/react'
import { memo } from 'react'

import { ManualRelationshipReason } from '../../domain/Relationship.js'
import {
	useOnFlip,
	useOnRemove,
	useOnRemoveConstraint,
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
	const removedItems = constraints.manualRelationships.filter(
		x => x.reason === ManualRelationshipReason.Removed,
	)
	const onRemove = useOnRemove(constraints, onUpdateConstraints)
	const onFlip = useOnFlip(constraints, onUpdateConstraints)
	const onRemoveConstraint = useOnRemoveConstraint(
		constraints,
		onUpdateConstraints,
	)

	const renderItem = useOnRenderItem(
		onSelect,
		onFlip,
		onRemove,
		onRemoveConstraint,
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
			{!!removedItems.length && <Label>Manually rejected</Label>}
			{removedItems.map(relationship => {
				return <div key={relationship.key}>{renderItem(relationship)}</div>
			})}
		</FocusZone>
	)
})
