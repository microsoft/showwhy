/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { fetchDiscoverResult } from '../../api'
import type {
	DiscoverProgressCallback,
	FetchDiscoverMetadata,
} from '../../api/types.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'
import { arrayIncludesVariable } from '../../domain/CausalVariable.js'
import type { Dataset } from '../../domain/Dataset.js'
import type { CausalGraph } from '../../domain/Graph.js'
import type { Relationship } from '../../domain/Relationship.js'
import { CancelablePromise } from '../../utils/CancelablePromise.js'
import type { DECIParams } from '../Algorithms/DECI.js'
import { CausalDiscoveryAlgorithm } from './CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from './CausalDiscoveryConstraints.js'
import type {
	CausalDiscoveryRequestReturnValue,
	CausalDiscoveryResult,
	CausalDiscoveryResultPromise,
	DatasetStatistics,
} from './CausalDiscoveryResult.js'

export function fromCausalDiscoveryResults(
	variables: CausalVariable[],
	results: CausalDiscoveryRequestReturnValue,
	constraints: CausalDiscoveryConstraints,
	algorithm: CausalDiscoveryAlgorithm,
): CausalGraph {
	const relationships = results.elements.edges.map(edge => {
		const sourceVar = variables.find(
			variable => variable.columnName === edge.data.source,
		)
		const targetVar = variables.find(
			variable => variable.columnName === edge.data.target,
		)
		if (sourceVar === undefined || targetVar === undefined) {
			throw new Error(
				`Causal discovery returned an edge for unknown variables: ${edge.data.source} -> ${edge.data.target}`,
			)
		}

		let effectString = 'an effect'
		if (edge.data.weight !== undefined) {
			effectString = edge.data.weight > 0 ? 'an increase' : 'a decrease'
		}

		const causalRelationship: Relationship = {
			source: sourceVar,
			target: targetVar,
			weight: edge.data.weight,
			name: `Increasing ${sourceVar.name} causes ${effectString} in ${targetVar.name}`,
			key: `${sourceVar.columnName}->${targetVar.columnName}`,
			confidence: edge.data.confidence,
			directed: true,
		}
		return causalRelationship
	})
	return {
		variables,
		relationships,
		constraints,
		algorithm,
		isDag: results.is_dag,
		hasConfidenceValues: results.has_confidence_values,
		interventionModelId: results.intervention_model_id,
	}
}

export function empty_discover_result(
	variables: CausalVariable[],
	constraints: CausalDiscoveryConstraints,
	algorithm: CausalDiscoveryAlgorithm,
): CausalDiscoveryResult {
	return {
		graph: { variables, relationships: [], constraints, algorithm },
	}
}

function empty_discover_result_promise(
	variables: CausalVariable[],
	constraints: CausalDiscoveryConstraints,
	algorithm: CausalDiscoveryAlgorithm,
) {
	const ret = new CancelablePromise<
		FetchDiscoverMetadata,
		CausalDiscoveryResult
	>({ taskId: undefined })

	ret.setFinished()
	ret.promise = Promise.resolve(
		empty_discover_result(variables, constraints, algorithm),
	)

	return ret
}

export function discover(
	dataset: Dataset,
	variables: CausalVariable[],
	constraints: CausalDiscoveryConstraints,
	algorithmName: CausalDiscoveryAlgorithm,
	progressCallback?: DiscoverProgressCallback,
	paramOptions?: DECIParams,
): CausalDiscoveryResultPromise {
	if (algorithmName === CausalDiscoveryAlgorithm.None) {
		return empty_discover_result_promise(variables, constraints, algorithmName)
	}

	/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
	const columns = variables.map(v => v.columnName)
	const jsonData = dataset.table.toJSON({ columns })
	const constraintsJson = createConstraintsJson(variables, constraints)
	const fetchDiscoverResultPromise = fetchDiscoverResult<any>(
		algorithmName.toLowerCase(),
		JSON.stringify({
			dataset: JSON.parse(jsonData),
			constraints: constraintsJson,
			causal_variables: variables.map(v => ({
				name: v.name,
				nature: v.nature,
			})),
			...paramOptions,
		}),
		progressCallback,
	)
	const causalDiscoverResultPromise =
		fetchDiscoverResultPromise as unknown as CausalDiscoveryResultPromise

	causalDiscoverResultPromise.promise =
		fetchDiscoverResultPromise.promise?.then(
			({ result: causalDiscoveryResult }) => {
				if (!causalDiscoveryResult) {
					throw Error('discover backend did not return any result')
				}

				const graph = fromCausalDiscoveryResults(
					variables,
					causalDiscoveryResult as CausalDiscoveryRequestReturnValue,
					constraints,
					algorithmName,
				)

				const datasetStatistics: DatasetStatistics | undefined =
					causalDiscoveryResult.dataset_statistics
						? {
								numberOfRows:
									causalDiscoveryResult.dataset_statistics.number_of_rows,
								numberOfDroppedRows:
									causalDiscoveryResult.dataset_statistics
										.number_of_dropped_rows,
						  }
						: undefined

				return {
					graph,
					normalizedColumnsMetadata:
						causalDiscoveryResult.normalized_columns_metadata,
					datasetStatistics,
				}
			},
		)
	/* eslint-enable */

	return causalDiscoverResultPromise
}

function createConstraintsJson(
	variables: CausalVariable[],
	constraints: CausalDiscoveryConstraints,
) {
	const constraintsJson = {
		causes: constraints.causes
			.filter(variable => arrayIncludesVariable(variables, variable))
			.map(variable => variable.columnName),
		effects: constraints.effects
			.filter(variable => arrayIncludesVariable(variables, variable))
			.map(variable => variable.columnName),
		forbiddenRelationships: constraints.manualRelationships
			.filter(
				relationship =>
					arrayIncludesVariable(variables, relationship.source) &&
					arrayIncludesVariable(variables, relationship.target),
			)
			.map(relationship => [
				relationship.source.columnName,
				relationship.target.columnName,
			]),
	}

	return constraintsJson
}
