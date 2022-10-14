/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { Relationship } from '../../domain/Relationship.js'
import type { Selectable } from '../../domain/Selection.js'
import {
	selectableIsCausalVariable,
	selectableIsRelationship,
} from '../../domain/Selection.js'
import {
	colorCorrelation,
	colorCorrelationFaded,
	colorNegative,
	colorNegativeFaded,
	colorNegativeFocused,
	colorNeutral,
	colorNeutralFaded,
	colorNeutralFocused,
	colorPositive,
	colorPositiveFaded,
	colorPositiveFocused,
} from '../../styles/styles.js'

export function useEdgeColors(
	relationship: Relationship,
	selectedObject: Selectable,
): {
	edgeColor: string
	correlationEdgeColor: string
} {
	let edgeColor = colorNeutral
	if (relationship.weight !== undefined && relationship.weight !== 0) {
		edgeColor = relationship.weight >= 0 ? colorPositive : colorNegative
	}

	let correlationEdgeColor = colorCorrelation
	if (selectableIsRelationship(selectedObject)) {
		if (selectedObject === relationship) {
			edgeColor = colorNeutralFocused
			if (relationship.weight !== undefined && relationship.weight !== 0) {
				edgeColor =
					relationship.weight >= 0 ? colorPositiveFocused : colorNegativeFocused
			}
		} else {
			edgeColor = colorNeutralFaded
			if (relationship.weight !== undefined && relationship.weight !== 0) {
				edgeColor =
					relationship.weight >= 0 ? colorPositiveFaded : colorNegativeFaded
			}

			correlationEdgeColor = colorCorrelationFaded
		}
	} else if (selectableIsCausalVariable(selectedObject)) {
		if (
			relationship.source === selectedObject ||
			relationship.target === selectedObject
		) {
			edgeColor = colorNeutral
			if (relationship.weight !== undefined && relationship.weight !== 0) {
				edgeColor = relationship.weight >= 0 ? colorPositive : colorNegative
			}
		} else {
			edgeColor = colorNeutralFaded
			if (relationship.weight !== undefined && relationship.weight !== 0) {
				edgeColor =
					relationship.weight >= 0 ? colorPositiveFaded : colorNegativeFaded
			}

			correlationEdgeColor = colorCorrelationFaded
		}
	}
	return useMemo(
		() => ({ edgeColor, correlationEdgeColor }),
		[edgeColor, correlationEdgeColor],
	)
}
