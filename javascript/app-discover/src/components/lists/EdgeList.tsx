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
	const [
		showDialogConfirm,
		{ toggle: toggleDialogConfirm, setFalse: closeDialogConfirm },
	] = useBoolean(false)
	const causes = constraints.causes.concat(constraints.effects)
	const [relationshipOption, setRelationshipOption] = useState<Relationship>()

	const onUpdateFlippedConstraint = useCallback(
		(relationship?: Relationship) => {
			if (!relationship) return
			const columns = [
				relationship.source.columnName,
				relationship.target.columnName,
			]
			const reverse = invertRelationship(relationship)
			const existingRelationships = [...constraints.manualRelationships]
			const newConstraints = {
				causes: constraints.causes.filter(x => !columns.includes(x.columnName)),
				effects: constraints.effects.filter(
					x => !columns.includes(x.columnName),
				),
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
			closeDialogConfirm()
		},
		[closeDialogConfirm, onUpdateConstraints, constraints],
	)

	const onFlip = useCallback(
		(relationship: Relationship) => {
			if (
				causes.find(x => x.columnName === relationship.source.columnName) ||
				causes.find(x => x.columnName === relationship.target.columnName)
			) {
				setRelationshipOption(relationship)
				return toggleDialogConfirm()
			}
			onUpdateFlippedConstraint(relationship)
		},
		[onUpdateFlippedConstraint, toggleDialogConfirm, causes],
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
				constraint={constraints?.manualRelationships?.find(x =>
					hasSameSourceAndTarget(x, relationship),
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
	const affects = relationships?.flatMap(r => {
		const yes =
			r?.weight === undefined && r.source.columnName === variable.columnName
		return yes ? renderItem(r, r.target.columnName) : []
	})
	const isAffectedBy = relationships?.flatMap(r => {
		const yes =
			r?.weight === undefined && r.target.columnName === variable.columnName
		return yes ? renderItem(r, r.source.columnName) : []
	})

	return (
		<FocusZone>
			<DialogConfirm
				onConfirm={() => onUpdateFlippedConstraint(relationshipOption)}
				toggle={toggleDialogConfirm}
				show={showDialogConfirm}
				title="Are you sure you want to proceed?"
				subText="Setting this constraint will remove any manual edges you pinned or flipped for this variable"
			></DialogConfirm>
			{!!increases.length && <Label>Increases:</Label>}
			{increases}
			{!!decreases.length && <Label>Decreases:</Label>}
			{decreases}
			{!!isIncreasedBy.length && <Label>Is increased by:</Label>}
			{isIncreasedBy}
			{!!isDecreasedBy.length && <Label>Is decreased by:</Label>}
			{isDecreasedBy}
			{!!affects.length && <Label>Affects:</Label>}
			{affects}
			{!!isAffectedBy.length && <Label>Is affected by:</Label>}
			{isAffectedBy}
		</FocusZone>
	)
})
