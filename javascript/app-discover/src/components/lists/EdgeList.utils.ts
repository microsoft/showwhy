/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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
	isEquivalentRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import type { VariableReference } from './../../domain/CausalVariable.js'

export function removeEdge(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
	const newConstraints = {
		...constraints,
		manualRelationships: [
			...constraints.manualRelationships.filter(
				r => !isEquivalentRelationship(r, relationship),
			),
			{
				...relationship,
				reason: ManualRelationshipReason.Removed,
			},
		],
	}
	onUpdateConstraints(newConstraints)
}

export function removeConstraint(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
	const newConstraints = {
		...constraints,
		manualRelationships: constraints.manualRelationships.filter(
			r => r !== relationship,
		),
	}
	onUpdateConstraints(newConstraints)
}
export function pinEdge(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
	const shouldUndo = constraints.manualRelationships.find(
		x => x.key === relationship.key,
	)
	const filtered = constraints.manualRelationships.filter(
		x => x.key !== relationship.key,
	)
	const newConstraints = {
		...constraints,
		manualRelationships: shouldUndo
			? filtered
			: [
					...filtered,
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
	relationship?: Relationship,
) {
	if (!relationship) return
	const columns = [
		relationship.source.columnName,
		relationship.target.columnName,
	]
	const reverse = invertRelationship(relationship)
	const existingRelationships = [...constraints.manualRelationships]
	const shouldUndo = constraints.manualRelationships.find(
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
		manualRelationships: shouldUndo
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
}

export function groupByEffectType(
	relationships: Relationship[],
	variableName: string,
): Record<string, Relationship[]> {
	return relationships.reduce(
		(acc: Record<string, Relationship[]>, obj: Relationship) => {
			let key = `Caused by ${variableName}`
			if (obj.source.columnName === variableName) {
				key = `Causes of ${variableName}`
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

export function isSource(
	relationship: Relationship,
	variableReference: VariableReference,
): boolean {
	return variableReference.columnName === relationship.source.columnName
}

export function isTarget(
	relationship: Relationship,
	variableReference: VariableReference,
): boolean {
	return variableReference.columnName === relationship.source.columnName
}
