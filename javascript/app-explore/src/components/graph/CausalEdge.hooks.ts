/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { RelationshipModificationType } from '../../domain/GraphDifferences.js'
import type { Relationship } from '../../domain/Relationship.js'
import type {
	Selectable} from '../../domain/Selection.js';
import {
	selectableIsCausalVariable,
	selectableIsRelationship,
} from '../../domain/Selection.js'
import {
	addedStyle,
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
	colorRemoved,
	removedStyle,
	reversedStyle,
} from '../../styles/styles.js'

export function useEdgeColors(
	relationship: Relationship,
	state: RelationshipModificationType,
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
	if (state === 'removed') {
		edgeColor = colorRemoved
	} else if (selectableIsRelationship(selectedObject)) {
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

export function useSvgStyle(
	state: RelationshipModificationType,
): React.CSSProperties {
	let svgStyle = {}
	if (state === 'removed') {
		svgStyle = removedStyle
	} else if (state === 'reversed') {
		svgStyle = reversedStyle
	} else if (state === 'added') {
		svgStyle = addedStyle
	}
	return svgStyle
}
