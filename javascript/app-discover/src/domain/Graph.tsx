/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalDiscoveryAlgorithm } from './CausalDiscovery/CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from './CausalDiscovery/CausalDiscoveryConstraints.js'
import type { ATEDetailsByName } from './CausalDiscovery/CausalDiscoveryResult.js'
import type { CausalVariable, VariableReference } from './CausalVariable.js'
import { arrayIncludesVariable, isSame } from './CausalVariable.js'
import {
	type Relationship,
	hasSameSourceAndTargetColumns,
	involvesVariable,
} from './Relationship.js'

export interface CausalGraph {
	variables: CausalVariable[]
	relationships: Relationship[]
	constraints: CausalDiscoveryConstraints
	algorithm: CausalDiscoveryAlgorithm
	isDag?: boolean
	hasConfidenceValues?: boolean
	interventionModelId?: string
	ateDetailsByName?: ATEDetailsByName
}

export function nodeHasChildren(
	graph: CausalGraph,
	variable: VariableReference,
	weightThreshold: number,
	confidenceThreshold: number,
): boolean {
	return relationshipsAboveThresholds(
		graph,
		weightThreshold,
		confidenceThreshold,
	).some((relationship) => isSame(relationship.source, variable))
}

export function nodeHasParents(
	graph: CausalGraph,
	variable: VariableReference,
	weightThreshold: number,
	confidenceThreshold: number,
): boolean {
	return relationshipsAboveThresholds(
		graph,
		weightThreshold,
		confidenceThreshold,
	).some((relationship) => isSame(relationship.target, variable))
}

export function relationshipsAboveWeightThreshold(
	graph: CausalGraph,
	threshold: number,
): Relationship[] {
	return graph.relationships.filter((relationship) =>
		isRelationshipAboveWeightThreshold(relationship, threshold),
	)
}

export function isRelationshipAboveWeightThreshold(
	relationship: Relationship,
	threshold: number,
): boolean {
	return (
		relationship.weight === undefined ||
		Math.abs(relationship.weight) > threshold
	)
}

export function relationshipsAboveConfidenceThreshold(
	graph: CausalGraph,
	threshold: number,
): Relationship[] {
	return graph.relationships.filter((relationship) =>
		isRelationshipAboveConfidenceThreshold(relationship, threshold),
	)
}

export function isRelationshipAboveConfidenceThreshold(
	relationship: Relationship,
	threshold: number,
): boolean {
	return (
		relationship.confidence === undefined ||
		Math.abs(relationship.confidence) > threshold
	)
}

export function relationshipsAboveThresholds(
	graph: CausalGraph,
	weightThreshold: number,
	confidenceThreshold: number,
): Relationship[] {
	return graph.relationships.filter((relationship) =>
		isRelationshipAboveThresholds(
			relationship,
			weightThreshold,
			confidenceThreshold,
		),
	)
}

export function isRelationshipAboveThresholds(
	relationship: Relationship,
	weightThreshold: number,
	confidenceThreshold: number,
): boolean {
	return (
		isRelationshipAboveWeightThreshold(relationship, weightThreshold) &&
		isRelationshipAboveConfidenceThreshold(relationship, confidenceThreshold)
	)
}

export function relationshipsForColumnNames(
	graph: CausalGraph,
	source: string,
	target: string,
): Relationship | undefined {
	return graph.relationships.find((relationship) =>
		hasSameSourceAndTargetColumns(relationship, source, target),
	)
}

export function validRelationshipsForColumnName(
	graph: CausalGraph,
	variable: VariableReference,
	weightThreshold: number,
	confidenceThreshold: number,
): Relationship[] | undefined {
	return graph.relationships
		?.flatMap((relationship) =>
			involvesVariable(relationship, variable) &&
			isRelationshipAboveThresholds(
				relationship,
				weightThreshold,
				confidenceThreshold,
			)
				? relationship
				: [],
		)
		?.sort((a, b) => Math.abs(b?.weight || 0) - Math.abs(a?.weight || 0))
}

export function includesVariable(
	graph: CausalGraph,
	variable: VariableReference,
): boolean {
	return arrayIncludesVariable(graph.variables, variable)
}

export function includesVariables(
	graph: CausalGraph,
	variables: VariableReference[],
): boolean {
	return variables
		.map((variable) => includesVariable(graph, variable))
		.every((included) => included)
}
