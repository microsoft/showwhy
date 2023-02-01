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
	invertRelationshipAndKey,
	involvesVariable,
	isEquivalentRelationship,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import type { VariableReference } from './../../domain/CausalVariable.js'
import { arrayIncludesVariable } from './../../domain/CausalVariable.js'

export function removeBothEdges(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: (newConstraints: CausalDiscoveryConstraints) => void,
	relationship: Relationship,
) {
	const reverse = invertRelationshipAndKey(relationship)
	const newConstraints = {
		...constraints,
		manualRelationships: [
			...constraints.manualRelationships.filter(
				(r) => !isEquivalentRelationship(r, relationship),
			),
			{
				...relationship,
				reason: ManualRelationshipReason.Removed,
			},
			{
				...reverse,
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
			(r) => r !== relationship,
		),
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
		(r) =>
			hasSameSourceAndTarget(r, relationship) &&
			hasSameReason(ManualRelationshipReason.Flipped, r),
	)
	const filtered = existingRelationships.filter(
		(r) =>
			!(
				hasSameSourceAndTarget(r, relationship) &&
				hasSameReason(ManualRelationshipReason.Flipped, r)
			),
	)
	const newConstraints = {
		causes: constraints.causes.filter((r) => !columns.includes(r.columnName)),
		effects: constraints.effects.filter((r) => !columns.includes(r.columnName)),
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
	const records: Record<string, Relationship[]> = {
		[`Causes ${variableName}`]: [],
		[`Caused by ${variableName}`]: [],
	}
	return relationships.reduce(
		(acc: Record<string, Relationship[]>, obj: Relationship) => {
			let key = `Causes ${variableName}`
			if (obj.source.columnName === variableName) {
				key = `Caused by ${variableName}`
			}

			acc[key].push(obj)
			return acc
		},
		records,
	)
}

export function isSource(
	relationship: Relationship,
	variableReference: VariableReference,
): boolean {
	return variableReference.columnName === relationship.source.columnName
}

export function rejectedItems(
	constraints: CausalDiscoveryConstraints,
	variable: VariableReference,
) {
	return constraints.manualRelationships.flatMap((x) => {
		if (
			x.reason === ManualRelationshipReason.Removed &&
			involvesVariable(x, variable)
		) {
			return x
		}
		return []
	})
}

export function hasConstraint(
	constraints: CausalDiscoveryConstraints,
	relationship: Relationship,
) {
	const allGeneralConstraints = constraints.causes.concat(constraints.effects)
	return (
		arrayIncludesVariable(allGeneralConstraints, relationship.target) ||
		arrayIncludesVariable(allGeneralConstraints, relationship.source)
	)
}

export function hasAnyConstraint(
	relationship: Relationship,
	constraints?: CausalDiscoveryConstraints,
) {
	if (!constraints) return false
	const manualConstraints = Object.values(constraints.manualRelationships)
	const hasManualConstraint = manualConstraints.some((x) =>
		isEquivalentRelationship(x, relationship),
	)
	return hasManualConstraint && hasConstraint(constraints, relationship)
}
