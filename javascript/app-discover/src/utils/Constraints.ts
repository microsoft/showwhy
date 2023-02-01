/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Relationship } from '../domain/Relationship.js'
import {
	arrayIncludesRelationship,
	ManualRelationshipReason,
} from '../domain/Relationship.js'

export function isRemovedConstraint(
	relationship: Relationship,
	allVariables: string[],
) {
	return (
		relationship.reason === ManualRelationshipReason.Removed &&
		(allVariables.includes(relationship.source.columnName) ||
			allVariables.includes(relationship.target.columnName))
	)
}
export function savedNotFound(
	relationships: Relationship[],
	relationship: Relationship,
	allVariables: string[],
) {
	return (
		relationship.reason === ManualRelationshipReason.Saved &&
		!arrayIncludesRelationship(relationships, relationship) &&
		(allVariables.includes(relationship.source.columnName) ||
			allVariables.includes(relationship.target.columnName))
	)
}
