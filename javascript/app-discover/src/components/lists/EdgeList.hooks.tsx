/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { Relationship } from '../../domain/Relationship.js'
import {
	hasSameSourceAndTarget,
	invertRelationship,
	involvesVariable,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import type {
	CausalVariable,
	VariableReference,
} from './../../domain/CausalVariable.js'
import { EdgeItem } from './EdgeItem.js'
import {
	flipEdge,
	isSource,
	pinEdge,
	removeConstraint,
	removeEdge,
} from './EdgeList.utils.js'

export function useOnPin(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
): (relationship: Relationship) => void {
	return useCallback(
		(relationship: Relationship) => {
			pinEdge(constraints, onUpdateConstraints, relationship)
		},
		[onUpdateConstraints, constraints],
	)
}
export function useOnRemove(
	constraints: CausalDiscoveryConstraints,
	onUpdateConstraints: SetterOrUpdater<CausalDiscoveryConstraints>,
): (relationship: Relationship) => void {
	return useCallback(
		(relationship: Relationship) => {
			removeEdge(constraints, onUpdateConstraints, relationship)
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
			return (
				<EdgeItem
					key={relationship.key}
					relationship={relationship}
					onFlip={onFlip}
					onRemove={onRemove}
					onRemoveConstraint={onRemoveConstraint}
					onSelect={onSelect}
					columnName={
						isSource(relationship, variable)
							? relationship.target.columnName
							: relationship.source.columnName
					}
					constraint={constraints?.manualRelationships?.find(x =>
						hasSameSourceAndTarget(x, relationship),
					)}
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

export function useOnAddAll(
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
			const newList = (columnCauses ? causedBy : causes).map(x => {
				return {
					...invertRelationship(x),
					reason: ManualRelationshipReason.Flipped,
				}
			})

			const clearConstraints = constraints.manualRelationships.filter(x => {
				if (
					involvesVariable(x, variable) &&
					x.reason !== ManualRelationshipReason.Removed
				) {
					return false
				}
				return true
			})

			onUpdateConstraints({
				...constraints,
				manualRelationships: [...clearConstraints, ...newList],
			})
		},
		[constraints, variable, relationships, onUpdateConstraints],
	)
}
