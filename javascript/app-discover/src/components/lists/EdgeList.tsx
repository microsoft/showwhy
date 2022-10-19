/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FocusZone, Label } from '@fluentui/react'
import { memo, useCallback } from 'react'

import {
	type Relationship,
	hasSameSourceAndTarget,
	invertRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { EdgeItem } from './EdgeItem.js'
import type { EdgeListProps } from './EdgeList.types.js'

export const EdgeList: React.FC<EdgeListProps> = memo(function EdgeList({
	relationships,
	variable,
	onSelect,
	constraints,
	onUpdateConstraints,
}) {
	const onFlip = useCallback(
		(relationship: Relationship) => {
			const reverse = invertRelationship(relationship)
			const existingRelationships = [...constraints.manualRelationships]
			const newConstraints = {
				...constraints,
				manualRelationships: constraints.manualRelationships.find(
					x =>
						hasSameSourceAndTarget(x, relationship) &&
						x.reason === ManualRelationshipReason.Flipped,
				)
					? existingRelationships.filter(
							x =>
								!(
									hasSameSourceAndTarget(x, relationship) &&
									x.reason === ManualRelationshipReason.Flipped
								),
					  )
					: [
							...existingRelationships,
							{
								...reverse,
								reason: ManualRelationshipReason.Flipped,
							},
					  ],
			}

			onUpdateConstraints(newConstraints)
		},
		[onUpdateConstraints, constraints],
	)

	const onPin = useCallback(
		(relationship: Relationship) => {
			let newConstraints = {
				...constraints,
				manualRelationships: [
					...constraints.manualRelationships,
					{
						...relationship,
						reason: ManualRelationshipReason.Pinned,
					},
				],
			}
			if (
				constraints.manualRelationships.find(x => x.key === relationship.key)
			) {
				newConstraints = {
					...constraints,
					manualRelationships: [
						...constraints.manualRelationships.filter(
							x => x.key !== relationship.key,
						),
					],
				}
			}

			onUpdateConstraints(newConstraints)
		},
		[onUpdateConstraints, constraints],
	)

	const onRemove = useCallback(
		(relationship: Relationship) => {
			const newConstraints = {
				...constraints,
				manualRelationships: [
					...constraints.manualRelationships,
					{
						...relationship,
						reason: ManualRelationshipReason.Removed,
					},
				],
			}
			onUpdateConstraints(newConstraints)
		},
		[onUpdateConstraints, constraints],
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
				constraint={constraints?.manualRelationships?.find(
					x =>
						x.source.columnName === relationship.source.columnName &&
						x.target.columnName === relationship.target.columnName,
				)}
			/>
		),
		[onSelect, onFlip, onPin, onRemove, constraints],
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
