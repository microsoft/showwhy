/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RelationshipWithWeight } from '../../domain/Relationship.js'

export interface CorrelationEdgeProps {
	correlation: RelationshipWithWeight
	minEdgeWidth: number
	maxEdgeWidth: number
}