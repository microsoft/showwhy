/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type { CausalVariable, VariableReference } from './CausalVariable.js'
import { applyMappingFromVariableToTable, isSame } from './CausalVariable.js'

export enum ManualRelationshipReason {
	Removed = 'Removed',
	Flipped = 'Flipped',
}

export interface RelationshipReference {
	source: VariableReference
	target: VariableReference
	reason?: ManualRelationshipReason
}

export type Relationship = RelationshipReference & {
	weight?: number
	sampleSize?: number
	confidence?: number
	name: string
	directed: boolean
	key: string
}

export type RelationshipWithWeight = Relationship & {
	weight: number
}

export type RelationshipWithConfidence = Relationship & {
	confidence: number
}

export type RelationshipWithWeightAndConfidence = RelationshipWithWeight &
	RelationshipWithConfidence

export function applyMappingsFromRelationshipToTable(
	sourceVariable: CausalVariable,
	targetVariable: CausalVariable,
	table: ColumnTable,
): ColumnTable {
	const selectedTable = table.select([
		sourceVariable.columnName,
		targetVariable.columnName,
	])
	const recodedSourceTable = applyMappingFromVariableToTable(
		sourceVariable,
		selectedTable,
		false,
	)
	const recodedSourceAndTargetTable = applyMappingFromVariableToTable(
		targetVariable,
		recodedSourceTable,
		false,
	)
	return recodedSourceAndTargetTable
}

export function invertRelationship(relationship: Relationship): Relationship {
	return {
		...relationship,
		source: relationship.target,
		target: relationship.source,
		name: `Inverse of ${relationship.name}`,
	}
}

export function hasSameSourceAndTarget(
	relationship: Relationship,
	asRelationship: Relationship,
) {
	return hasSameSourceAndTargetColumns(
		relationship,
		asRelationship.source.columnName,
		asRelationship.target.columnName,
	)
}

export function hasSameSourceAndTargetColumns(
	relationship: Relationship,
	source: string,
	target: string,
) {
	return (
		source === relationship.source.columnName &&
		target === relationship.target.columnName
	)
}

export function hasInvertedSourceAndTarget(
	relationship: Relationship,
	asRelationship: Relationship,
) {
	return hasInvertedSourceAndTargetColumns(
		relationship,
		asRelationship.source.columnName,
		asRelationship.target.columnName,
	)
}

export function hasInvertedSourceAndTargetColumns(
	relationship: Relationship,
	source: string,
	target: string,
) {
	return (
		source === relationship.target.columnName &&
		target === relationship.source.columnName
	)
}

export function hasSameOrInvertedSourceAndTarget(
	relationship: Relationship,
	asRelationship: Relationship,
) {
	return (
		hasSameSourceAndTarget(relationship, asRelationship) ||
		hasInvertedSourceAndTarget(relationship, asRelationship)
	)
}

export function hasSameOrInvertedSourceAndTargetColumnNames(
	relationship: Relationship,
	source: string,
	target: string,
) {
	return (
		hasSameSourceAndTargetColumns(relationship, source, target) ||
		hasInvertedSourceAndTargetColumns(relationship, source, target)
	)
}

export function involvesVariable(
	relationship: Relationship,
	variable: VariableReference,
) {
	return (
		isSame(relationship.source, variable) ||
		isSame(relationship.target, variable)
	)
}

export function arrayIncludesRelationship(
	relationships: Relationship[],
	relationship: Relationship,
) {
	return relationships.some(otherRelationship =>
		hasSameSourceAndTarget(relationship, otherRelationship),
	)
}

export function hasSameReason(
	reason: ManualRelationshipReason,
	relationship?: Relationship,
) {
	return relationship?.reason === reason
}

export function isEquivalentRelationship(
	relationship: Relationship,
	asRelationship: Relationship,
) {
	return (
		hasSameSourceAndTarget(relationship, asRelationship) ||
		(hasSameReason(ManualRelationshipReason.Flipped, asRelationship) &&
			hasInvertedSourceAndTarget(relationship, asRelationship))
	)
}
