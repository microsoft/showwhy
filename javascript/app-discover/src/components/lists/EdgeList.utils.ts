/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { Relationship } from '../../domain/Relationship.js'
import {
	hasSameReason,
	hasSameSourceAndTarget,
	invertRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'

export function removeEdge(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
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
}
export function pinEdge(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
	const newConstraints = {
		...constraints,
		manualRelationships: [
			...constraints.manualRelationships.filter(
				x => x.key !== relationship.key,
			),
			{
				...relationship,
				reason: ManualRelationshipReason.Pinned,
			},
		],
	}
	onUpdateConstraints(newConstraints)
}

export function flipEdge(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	closeDialogConfirm: () => void,
	relationship?: Relationship,
) {
	if (!relationship) return
	const columns = [
		relationship.source.columnName,
		relationship.target.columnName,
	]
	const reverse = invertRelationship(relationship)
	const existingRelationships = [...constraints.manualRelationships]
	const isFlipped = constraints.manualRelationships.find(
		r =>
			hasSameSourceAndTarget(r, relationship) &&
			hasSameReason(ManualRelationshipReason.Flipped, r),
	)
	const filtered = existingRelationships.filter(
		r =>
			!(
				hasSameSourceAndTarget(r, relationship) &&
				hasSameReason(ManualRelationshipReason.Flipped, r)
			),
	)
	const newConstraints = {
		causes: constraints.causes.filter(r => !columns.includes(r.columnName)),
		effects: constraints.effects.filter(r => !columns.includes(r.columnName)),
		manualRelationships: isFlipped
			? filtered
			: [
					...filtered,
					{
						...reverse,
						reason: ManualRelationshipReason.Flipped,
					},
			  ],
	} as CausalDiscoveryConstraints

	onUpdateConstraints(newConstraints)
	closeDialogConfirm()
}

export function groupByEffectType(
	relationships: Relationship[],
	variableName: string,
): { [index: string]: Relationship[] } {
	return relationships.reduce(
		(acc: { [index: string]: Relationship[] }, obj: Relationship) => {
			let key = 'Is affected by'
			switch (true) {
				case obj.weight === undefined:
					if (obj.source.columnName === variableName) {
						key = 'Affects'
					}
					break
				case (obj.weight || 0) > 0:
					if (obj.source.columnName === variableName) {
						key = 'Increases'
						break
					}
					key = 'Is increased by'
					break

				case (obj.weight || 0) < 0:
					if (obj.source.columnName === variableName) {
						key = 'Decreases'
						break
					}
					key = 'Is decreased by'
			}

			if (!acc[key]) {
				acc[key] = []
			}

			acc[key].push(obj)
			return acc
		},
		{},
	)
}
