/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { agg, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import type {
	CausalVariable,
	VariableReference,
} from '../domain/CausalVariable.js'
import type {
	Relationship,
	RelationshipWithWeight,
} from '../domain/Relationship.js'
import {
	hasInvertedSourceAndTargetColumns,
	hasSameSourceAndTargetColumns,
	invertRelationship,
	involvesVariable,
} from '../domain/Relationship.js'
import { VariableNature } from '../domain/VariableNature.js'

export function correlationMatrix(table: ColumnTable, maxSampleSize?: number) {
	const variables = table.columnNames().map((columnName) => ({ columnName }))
	const correlations: RelationshipWithWeight[] = []
	for (let i = 0; i < variables.length; i++) {
		const variableA = variables[i]
		for (let j = i + 1; j < variables.length; j++) {
			const variableB = variables[j]
			const corr = correlation(table, variableA, variableB, maxSampleSize)
			correlations.push(corr)
		}
	}

	const sortedCorrelations = correlations.sort(
		(a, b) => Math.abs(b.weight) - Math.abs(a.weight),
	)
	return sortedCorrelations
}

export function filterBoringRelationships(
	variables: Map<string, CausalVariable>,
	relationships: Relationship[],
) {
	return relationships.filter((relationship) => {
		const { source: variableRefA, target: variableRefB } = relationship
		const variableA = variables.get(variableRefA.columnName)
		const variableB = variables.get(variableRefB.columnName)
		return (
			variableA &&
			variableB &&
			!(
				variableA.derivedFrom?.includes(variableB.columnName) ||
				variableB.derivedFrom?.includes(variableA.columnName) ||
				variableA.derivedFrom?.some((valA) =>
					variableB.derivedFrom?.some((valB) => valA === valB),
				) ||
				variableB.derivedFrom?.some((valB) =>
					variableA.derivedFrom?.some((valA) => valA === valB),
				) ||
				variableA.disallowedRelationships?.includes(variableB.columnName) ||
				variableB.disallowedRelationships?.includes(variableA.columnName) ||
				variableA.nature === VariableNature.CategoricalNominal ||
				variableB.nature === VariableNature.CategoricalNominal
			)
		)
	})
}

export function getVariablePairs(table: ColumnTable) {
	const variables = table.columnNames()
	const variablePairs = []
	for (let i = 0; i < variables.length; i++) {
		const variableA = variables[i]
		for (let j = i + 1; j < variables.length; j++) {
			const variableB = variables[j]
			variablePairs.push({ source: variableA, target: variableB })
		}
	}

	return variablePairs
}

export function correlationsInTable(
	table: ColumnTable | undefined,
	maxSampleSize?: number,
	useWorker = false,
): Promise<RelationshipWithWeight[]> {
	if (!table) {
		return Promise.resolve([])
	}
	if (useWorker) {
		const allVariablePairs = getVariablePairs(table)
		const sampledTable = maxSampleSize ? table.sample(maxSampleSize) : table

		// using a variable for the import path prevents webpack from bundling the worker
		const workerPath = 'workers/correlation.js'
		const correlationWorker = new Worker(workerPath, { type: 'module' })
		const correlationResultsPromise = new Promise<RelationshipWithWeight[]>(
			(resolve) => {
				correlationWorker.onmessage = (e) => {
					resolve(e.data as RelationshipWithWeight[])
				}
			},
		)
		correlationWorker.postMessage([
			sampledTable.toArrowBuffer(),
			allVariablePairs,
		])
		return correlationResultsPromise
	}

	return Promise.resolve(correlationMatrix(table, maxSampleSize))
}

export function correlation(
	table: ColumnTable,
	variableA: VariableReference,
	variableB: VariableReference,
	maxSampleSize?: number,
) {
	const variableAColumn = variableA.columnName
	const variableBColumn = variableB.columnName
	const selectedColumns = table.select(variableAColumn, variableBColumn)
	const sampledColumns = maxSampleSize
		? selectedColumns.sample(maxSampleSize)
		: selectedColumns
	const correlationColumns = sampledColumns
		.filter(`d => d['${variableAColumn}'] !== null`)
		.filter(`d => d['${variableBColumn}'] !== null`)
	const corr = agg(
		correlationColumns,
		op.corr(variableAColumn, variableBColumn),
	) as number
	const sampleSize = correlationColumns.numRows()

	return {
		source: variableA,
		target: variableB,
		weight: corr,
		name: `Correlation of ${corr} between ${variableAColumn} and ${variableBColumn}`,
		confidence: 1,
		sampleSize,
		directed: false,
		key: `${variableAColumn}-${variableBColumn}`,
	}
}

export function correlationsForVariable(
	correlations: RelationshipWithWeight[],
	variable: CausalVariable,
) {
	return correlations.filter((correlation) =>
		involvesVariable(correlation, variable),
	)
}

export function correlationForVariables(
	correlations: RelationshipWithWeight[],
	variableA: VariableReference,
	variableB: VariableReference,
) {
	return correlations.find(
		(correlation) =>
			involvesVariable(correlation, variableA) &&
			involvesVariable(correlation, variableB),
	)
}

export function correlationForColumnNames(
	correlations: RelationshipWithWeight[],
	source: string,
	target: string,
) {
	const forwardCorrelation = correlations.find((correlation) =>
		hasSameSourceAndTargetColumns(correlation, source, target),
	)
	if (forwardCorrelation !== undefined) {
		return forwardCorrelation
	}

	const inverseCorrelation = correlations.find((correlation) =>
		hasInvertedSourceAndTargetColumns(correlation, source, target),
	)
	if (inverseCorrelation !== undefined) {
		return invertRelationship(inverseCorrelation)
	}
}
