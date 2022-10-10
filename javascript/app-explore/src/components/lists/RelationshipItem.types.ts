/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Relationship } from '../../domain/Relationship.jsx'

export interface RelationshipItemProps {
	relationship: Relationship
	toColumnName?: string
}
