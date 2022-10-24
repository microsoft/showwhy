/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Relationship } from '../../domain/Relationship.js'
import {
	hasSameReason,
	ManualRelationshipReason,
} from '../../domain/Relationship.js'
import { icons } from '../lists/EdgeItem.styles.js'

export function getConstraintIconName(constraint: Relationship) {
	return hasSameReason(ManualRelationshipReason.Flipped, constraint)
		? icons.switch.iconName
		: hasSameReason(ManualRelationshipReason.Removed, constraint)
		? icons.delete.iconName
		: icons.pinned.iconName
}
