/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Relationship } from '../../domain/Relationship.js'

export interface CausalEdgeProps {
	relationship: Relationship
	minEdgeWidth: number
	maxEdgeWidth: number
}
