/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { VariableReference } from './CausalVariable.js'
import type { RelationshipReference } from './Relationship.js'

export type Selectable = RelationshipReference | VariableReference | undefined

export function selectableIsRelationship(
	selectable: Selectable,
): selectable is RelationshipReference {
	return (
		selectable !== undefined &&
		(selectable as RelationshipReference).source !== undefined &&
		(selectable as RelationshipReference).target !== undefined
	)
}

export function selectableIsCausalVariable(
	selectable: Selectable,
): selectable is VariableReference {
	return selectable !== undefined && !selectableIsRelationship(selectable)
}
