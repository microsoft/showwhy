/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, Label } from '@fluentui/react'
import { memo, useCallback } from 'react'
import { useRecoilState } from 'recoil'

import {
	type Relationship,
	invertRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { CausalGraphConstraintsState } from '../../state/index.js'
import { EdgeItem } from './EdgeItem.js'
import type { EdgeListProps } from './EdgeList.types.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
}) {
	const [constraints, setConstraints] = useRecoilState(
		CausalGraphConstraintsState,
	)

	const onFlip = useCallback(
		(relationship: Relationship) => {
			const existingRelationships = constraints.forbiddenRelationships.filter(
				x => x.target.columnName !== relationship.source.columnName,
			)
			const newConstraints = {
				...constraints,
				forbiddenRelationships: [
					...existingRelationships,
					{
						...relationship,
						reason: ManualRelationshipReason.Flipped,
					},
				],
			}
			setConstraints(newConstraints)
		},
		[setConstraints, constraints],
	)

	const onPin = useCallback(
		(relationship: Relationship) => {
			const reverse = invertRelationship(relationship)
			reverse.reason = ManualRelationshipReason.Pinned
			const newConstraints = {
				...constraints,
				forbiddenRelationships: [
					...constraints.forbiddenRelationships,
					reverse,
				],
			}
			setConstraints(newConstraints)
		},
		[setConstraints, constraints],
	)

	const onRemove = useCallback(
		(relationship: Relationship) => {
			const newConstraints = {
				...constraints,
				forbiddenRelationships: [
					...constraints.forbiddenRelationships,
					{
						...relationship,
						reason: ManualRelationshipReason.Removed,
					},
				],
			}
			setConstraints(newConstraints)
		},
		[setConstraints, constraints],
	)

	const renderItem = useCallback(
		(relationship: Relationship, columnName: string) => (
			<EdgeItem
				key={relationship.key}
				relationship={relationship}
				onFlip={onFlip}
				onRemove={onRemove}
				onPin={onPin}
				onSelect={onSelect}
				columnName={columnName}
			/>
		),
		[onSelect, onFlip, onPin, onRemove],
	)

	const increases = relationships?.flatMap(r => {
		const yes =
			(r?.weight || 0) > 0 && r.source.columnName === variable.columnName
		return yes ? renderItem(r, r.target.columnName) : []
	})

	const decreases = relationships?.flatMap(r => {
		const yes =
			(r?.weight || 0) < 0 && r.source.columnName === variable.columnName
		return yes ? renderItem(r, r.target.columnName) : []
	})

	const isIncreasedBy = relationships?.flatMap(r => {
		const yes =
			(r?.weight || 0) > 0 && r.target.columnName === variable.columnName
		return yes ? renderItem(r, r.source.columnName) : []
	})

	const isDecreasedBy = relationships?.flatMap(r => {
		const yes =
			(r?.weight || 0) < 0 && r.target.columnName === variable.columnName
		return yes ? renderItem(r, r.source.columnName) : []
	})

	return (
		<FocusZone>
			{!!increases.length && <Label>Increases:</Label>}
			{increases}
			{!!decreases.length && <Label>Decreases:</Label>}
			{decreases}
			{!!isIncreasedBy.length && <Label>Is increased by:</Label>}
			{isIncreasedBy}
			{!!isDecreasedBy.length && <Label>Is decreased by:</Label>}
			{isDecreasedBy}
		</FocusZone>
	)
})
