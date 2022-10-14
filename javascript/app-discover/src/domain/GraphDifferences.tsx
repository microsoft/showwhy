/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalVariable } from './CausalVariable.js'
import type {
	Relationship,
	RelationshipWithWeightAndConfidence,
} from './Relationship.js'
import { hasSameSourceAndTarget } from './Relationship.js'

export interface ModifiedRelationship {
	previous: Relationship
	current: Relationship
	difference: RelationshipWithWeightAndConfidence
}

export interface GraphDifferences {
	addedVariables: CausalVariable[]
	removedVariables: CausalVariable[]
	addedRelationships: Relationship[]
	removedRelationships: Relationship[]
	commonRelationships: Relationship[]
	reversedRelationships: Relationship[]
	modifiedRelationships: ModifiedRelationship[]
}

export type RelationshipModificationType =
	| 'normal'
	| 'added'
	| 'removed'
	| 'modifiedUp'
	| 'modifiedDown'
	| 'reversed'

export function getModifiedRelationship(
	relationships: ModifiedRelationship[],
	relationship: Relationship,
) {
	return relationships.find(
		({ previous, current }) =>
			hasSameSourceAndTarget(relationship, previous) ||
			hasSameSourceAndTarget(relationship, current),
	)
}
