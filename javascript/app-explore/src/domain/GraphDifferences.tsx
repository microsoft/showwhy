/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalVariable } from './CausalVariable.js'
import { isSame } from './CausalVariable.js'
import type { CausalGraph } from './Graph.js'
import * as Graph from './Graph.js'
import type {
	Relationship,
	RelationshipWithWeightAndConfidence,
} from './Relationship.js'
import {
	hasInvertedSourceAndTarget,
	hasSameOrInvertedSourceAndTarget,
	hasSameSourceAndTarget,
} from './Relationship.js'

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

export function findDifferencesBetweenGraphs(
	priorGraph: CausalGraph,
	currentGraph: CausalGraph,
	weightThreshold: number,
	confidenceThreshold: number,
	weightDifferenceThreshold = 0.01,
): GraphDifferences {
	const removedVariables = priorGraph.variables.filter(
		priorVariable =>
			!currentGraph.variables.some(currentVariable =>
				isSame(priorVariable, currentVariable),
			),
	)
	const addedVariables = currentGraph.variables.filter(
		currentVariable =>
			!priorGraph.variables.some(priorVariable =>
				isSame(currentVariable, priorVariable),
			),
	)

	const priorGraphRelationships = Graph.relationshipsAboveThresholds(
		priorGraph,
		weightThreshold,
		confidenceThreshold,
	)
	const currentGraphRelationships = Graph.relationshipsAboveThresholds(
		currentGraph,
		weightThreshold,
		confidenceThreshold,
	)

	const addedRelationships = currentGraphRelationships.filter(
		currentRelationship =>
			!priorGraphRelationships.some(priorRelationship =>
				hasSameOrInvertedSourceAndTarget(
					currentRelationship,
					priorRelationship,
				),
			),
	)
	const removedRelationships = priorGraphRelationships.filter(
		priorRelationship =>
			!currentGraphRelationships.some(currentRelationship =>
				hasSameOrInvertedSourceAndTarget(
					priorRelationship,
					currentRelationship,
				),
			),
	)
	const commonRelationships = currentGraphRelationships.filter(
		currentRelationship =>
			priorGraphRelationships.some(priorRelationship =>
				hasSameSourceAndTarget(currentRelationship, priorRelationship),
			),
	)
	const reversedRelationships = currentGraphRelationships.filter(
		currentRelationship =>
			priorGraphRelationships.some(priorRelationship =>
				hasInvertedSourceAndTarget(currentRelationship, priorRelationship),
			),
	)
	const modifiedRelationships = commonRelationships
		.map(relationship => {
			const previous = Graph.relationshipsForColumnNames(
				priorGraph,
				relationship.source.columnName,
				relationship.target.columnName,
			) as Relationship
			const current = Graph.relationshipsForColumnNames(
				currentGraph,
				relationship.source.columnName,
				relationship.target.columnName,
			) as Relationship
			const weightDifference = (current.weight || 0) - (previous.weight || 0)
			const confidenceDifference =
				(current.confidence || 0) - (previous.confidence || 0)
			const difference = {
				...current,
				weight: weightDifference,
				name: `Relationship between ${current.source} and ${current.target} changed by ${weightDifference}`,
				confidence: confidenceDifference,
			}
			return { previous, current, difference }
		})
		.filter(
			relationshipChange =>
				Math.abs(relationshipChange!.difference.confidence) > 0 ||
				Math.abs(relationshipChange!.difference.weight) >
					weightDifferenceThreshold,
		)

	return {
		addedVariables,
		removedVariables,
		addedRelationships,
		removedRelationships,
		commonRelationships,
		reversedRelationships,
		modifiedRelationships,
	}
}

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
