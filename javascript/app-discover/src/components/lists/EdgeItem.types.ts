/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Relationship } from '../../domain/Relationship.jsx'

export interface EdgeItemProps {
	relationship: Relationship
	columnName: string
	onFlip: (relationship: Relationship) => void
	onSave: (relationship: Relationship) => void
	onRemove: (relationship: Relationship) => void
	onRemoveConstraint: (relationship: Relationship) => void
	onSelect: (relationship: Relationship) => void
	constraint?: Relationship
	flipAllowed?: boolean
	notFound?: boolean
}
