/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { CausalDiscoveryConstraints } from '../../domain/CausalDiscovery/CausalDiscoveryConstraints.js'
import type { Relationship } from '../../domain/Relationship.js'
import { hasSameSourceAndTarget } from '../../domain/Relationship.js'
import type { CausalVariable } from './../../domain/CausalVariable.js'
import { EdgeItem } from './EdgeItem.js'
import { flipEdge, pinEdge, removeEdge } from './EdgeList.utils.js'

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

export function useOnRenderItem(
	onSelect: (relationship: Relationship) => void,
	onFlip: (relationship: Relationship) => void,
	onPin: (relationship: Relationship) => void,
	onRemove: (relationship: Relationship) => void,
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
