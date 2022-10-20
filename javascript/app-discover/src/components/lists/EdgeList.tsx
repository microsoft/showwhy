/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DialogConfirm } from '@essex/components'
import { FocusZone, Label } from '@fluentui/react'
import { useBoolean } from '@fluentui/react-hooks'
import { memo, useCallback, useState } from 'react'

import {
	type Relationship,
	hasSameSourceAndTarget,
} from '../../domain/Relationship.js'
import { EdgeItem } from './EdgeItem.js'
import type { EdgeListProps } from './EdgeList.types.js'
import {
	flipEdge,
	groupByEffectType,
	pinEdge,
	removeEdge,
} from './EdgeList.utils.js'

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

	const onFlip = useCallback(
		(relationship: Relationship) => {
			if (
				generalConstraintsCauses.find(
					x => x.columnName === relationship.source.columnName,
				) ||
				generalConstraintsCauses.find(
					x => x.columnName === relationship.target.columnName,
				)
			) {
				setRelationshipOption(relationship)
				return toggleDialogConfirm()
			}
			onUpdateFlippedConstraint(relationship)
		},
		[onUpdateFlippedConstraint, toggleDialogConfirm, generalConstraintsCauses],
	)

	const onPin = useCallback(
		(relationship: Relationship) => {
			pinEdge(constraints, onUpdateConstraints, relationship)
		},
		[onUpdateConstraints, constraints],
	)

	const onRemove = useCallback(
		(relationship: Relationship) => {
			removeEdge(constraints, onUpdateConstraints, relationship)
		},
		[constraints, onUpdateConstraints],
	)

	const renderItem = useCallback(
		(relationship: Relationship) => {
			if (!relationship) return undefined
			return (
				<EdgeItem
					key={relationship.key}
					relationship={relationship}
					onFlip={onFlip}
					onRemove={onRemove}
					onPin={onPin}
					onSelect={onSelect}
					columnName={
						variable.columnName === relationship.source.columnName
							? relationship.target.columnName
							: relationship.source.columnName
					}
					constraint={constraints?.manualRelationships?.find(x =>
						hasSameSourceAndTarget(x, relationship),
					)}
				/>
			)
		},
		[onSelect, onFlip, onPin, onRemove, variable, constraints],
	)

	return (
		<FocusZone>
			<DialogConfirm
				onConfirm={() => onUpdateFlippedConstraint(relationshipOption)}
				toggle={toggleDialogConfirm}
				show={showDialogConfirm}
				title="Are you sure you want to proceed?"
				subText="Setting this constraint will remove any manual edges you pinned or flipped for this variable"
			></DialogConfirm>
			{Object.keys(groupedList).map(groupName => {
				return (
					<>
						<Label>{groupName}</Label>
						{groupedList[groupName].map(r => renderItem(r))}
					</>
				)
			})}
		</FocusZone>
	)
})
