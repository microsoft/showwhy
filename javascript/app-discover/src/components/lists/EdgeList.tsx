/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, Label, TooltipHost } from '@fluentui/react'
import { memo } from 'react'

import { ManualRelationshipReason } from '../../domain/Relationship.js'
import { IconButtonDark } from '../../styles/styles.js'
import {
	useOnAddAll,
	useOnFlip,
	useOnRemove,
	useOnRemoveConstraint,
	useOnRenderItem,
} from './EdgeList.hooks.js'
import { Container, icons, LabelContainer } from './EdgeList.styles.js'
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
	const onAddAll = useOnAddAll(
		constraints,
		onUpdateConstraints,
		variable,
		relationships,
	)
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
					<Container key={groupName}>
						<LabelContainer>
							<Label>{groupName}</Label>
							<TooltipHost content={`Set all edges as ${groupName}`}>
								<IconButtonDark
									onClick={() => onAddAll(groupName)}
									iconProps={icons.add}
								/>
							</TooltipHost>
						</LabelContainer>
						{groupedList[groupName].map(r => renderItem(r))}
					</Container>
				)
			})}
			{!!removedItems.length && <Label>Manually rejected</Label>}
			{removedItems.map(relationship => {
				return (
					<Container key={relationship.key}>
						{renderItem(relationship)}
					</Container>
				)
			})}
		</FocusZone>
	)
})
