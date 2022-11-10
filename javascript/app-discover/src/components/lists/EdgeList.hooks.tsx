/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { Relationship } from '../../domain/Relationship.js'
import {
	arrayIncludesRelationship,
	hasSameSourceAndTarget,
	isInverseRemoved,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import type {
	CausalVariable,
	VariableReference,
} from './../../domain/CausalVariable.js'
import { EdgeItem } from './EdgeItem.js'
import {
	flipEdge,
	hasConstraint,
	isSource,
	removeBothEdges,
	removeConstraint,
} from './EdgeList.utils.js'

export function useOnRemove(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
): (relationship: Relationship) => void {
	return useCallback(
		(relationship: Relationship) => {
			removeBothEdges(constraints, onUpdateConstraints, relationship)
		},
		[constraints, onUpdateConstraints],
	)
}
export function useOnRemoveConstraint(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
): (relationship: Relationship) => void {
	return useCallback(
		(relationship: Relationship) => {
			removeConstraint(constraints, onUpdateConstraints, relationship)
		},
		[constraints, onUpdateConstraints],
	)
}

export function useOnRenderItem(
	onSelect: (relationship: Relationship) => void,
	onFlip: (relationship: Relationship) => void,
	onRemove: (relationship: Relationship) => void,
	onRemoveConstraint: (relationship: Relationship) => void,
	variable: CausalVariable,
	constraints: CausalDiscoveryConstraints,
): (relationship: Relationship) => JSX.Element | undefined {
	return useCallback(
		(relationship: Relationship) => {
			if (!relationship) return undefined
			const constraint = constraints?.manualRelationships?.find(x =>
				hasSameSourceAndTarget(x, relationship),
			)
			const flipRejected = constraints?.manualRelationships?.find(x =>
				isInverseRemoved(relationship, x),
			)

			const hasConstraints = hasConstraint(constraints, relationship)
			return (
				<EdgeItem
					key={relationship.key}
					relationship={relationship}
					onFlip={onFlip}
					onRemove={onRemove}
					onRemoveConstraint={onRemoveConstraint}
					onSelect={onSelect}
					flipAllowed={!flipRejected && !hasConstraints}
					columnName={
						isSource(relationship, variable)
							? relationship.target.columnName
							: relationship.source.columnName
					}
					constraint={constraint}
				/>
			)
		},
		[onSelect, onFlip, onRemove, onRemoveConstraint, variable, constraints],
	)
}

export function useOnFlip(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
): (relationship: Relationship) => void {
	return useCallback(
		(relationship: Relationship) => {
			flipEdge(constraints, onUpdateConstraints, relationship)
		},
		[constraints, onUpdateConstraints],
	)
}

export function useOnRemoveAll(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
	variable: VariableReference,
	relationships: Relationship[],
): (groupName: string) => void {
	return useCallback(
		(groupName: string) => {
			const columnCauses = groupName.toLowerCase().includes('causes')
			const causes = relationships.filter(x => !isSource(x, variable))
			const causedBy = relationships.filter(x => isSource(x, variable))
			const newList = (columnCauses ? causes : causedBy).map(x => {
				return {
					...x,
					reason: ManualRelationshipReason.Removed,
				}
			})

			const clearConstraints = constraints.manualRelationships.filter(
				x => !arrayIncludesRelationship(newList, x),
			)

			onUpdateConstraints({
				...constraints,
				manualRelationships: [...clearConstraints, ...newList],
			})
		},
		[constraints, variable, relationships, onUpdateConstraints],
	)
}
