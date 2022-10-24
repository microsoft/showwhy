/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DialogConfirm } from '@essex/components'
import { FocusZone, Label } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useState } from 'react'

import { type Relationship } from '../../domain/Relationship.js'
import {
	useOnConfirmFlip,
	useOnFlip,
	useOnPin,
	useOnRemove,
	useOnRenderItem,
} from './EdgeList.hooks.js'
import type { EdgeListProps } from './EdgeList.types.js'
import { flipEdge, groupByEffectType } from './EdgeList.utils.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
	constraints,
	onUpdateConstraints,
}) {
	const groupedList = groupByEffectType(relationships, variable.columnName)
	const [
		showDialogConfirm,
		{ toggle: toggleDialogConfirm, setFalse: closeDialogConfirm },
	] = useBoolean(false)
	const [relationshipOption, setRelationshipOption] = useState<Relationship>()
	const generalConstraintsCauses = constraints.causes.concat(
		constraints.effects,
	)

	const onUpdateFlippedConstraint = useCallback(
		(relationship?: Relationship) => {
			flipEdge(
				constraints,
				onUpdateConstraints,
				closeDialogConfirm,
				relationship,
			)
		},
		[closeDialogConfirm, onUpdateConstraints, constraints],
	)

	const onFlip = useOnFlip(
		generalConstraintsCauses,
		setRelationshipOption,
		toggleDialogConfirm,
		onUpdateFlippedConstraint,
	)

	const onPin = useOnPin(constraints, onUpdateConstraints)
	const onRemove = useOnRemove(constraints, onUpdateConstraints)

	const renderItem = useOnRenderItem(
		onSelect,
		onFlip,
		onPin,
		onRemove,
		variable,
		constraints,
	)

	const onConfirmFlip = useOnConfirmFlip(
		onUpdateFlippedConstraint,
		relationshipOption,
	)

	return (
		<FocusZone>
			<DialogConfirm
				onConfirm={onConfirmFlip}
				toggle={toggleDialogConfirm}
				show={showDialogConfirm}
				title="Are you sure you want to proceed?"
				subText="Setting this constraint will remove any manual edges you pinned or flipped for this variable"
			></DialogConfirm>
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
