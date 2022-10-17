/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { CausalInferenceModel } from '../../domain/CausalInference.js'
import type { CausalVariable } from '../../domain/CausalVariable.js'
import { arrayIncludesVariable } from '../../domain/CausalVariable.js'
import type { Dataset } from '../../domain/Dataset.js'
import type { CausalGraph } from '../../domain/Graph.js'
import type { Relationship } from '../../domain/Relationship.js'
import {
	CausalDiscoveryAlgorithm,
	CausalDiscoveryAlgorithmOptions,
} from './CausalDiscoveryAlgorithm.js'
import type { CausalDiscoveryConstraints } from './CausalDiscoveryConstraints.js'
import type {
	CausalDiscoveryRequestReturnValue,
	CausalDiscoveryResult,
} from './CausalDiscoveryResult.js'

// TODO: We are loading onnxruntime-web from a script tag at the moment to work around an issue with
// vite not handling its WASM files correctly.
// Relevant github issues:
// https://github.com/microsoft/onnxruntime/issues/10140
// https://github.com/microsoft/onnxruntime-web-demo/issues/15
// import * as ort from 'onnxruntime-web';
declare const ort: any

const RUN_CAUSAL_DISCOVERY_BASE_URL = process.env.DISCOVER_API_URL?.endsWith(
	'/',
)
	? process.env.DISCOVER_API_URL
	: `${process.env.DISCOVER_API_URL || '/api/discover'}/`

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
	return { variables, relationships, constraints, algorithm }
}

export async function discover(
	dataset: Dataset,
	variables: CausalVariable[],
	constraints: CausalDiscoveryConstraints,
	algorithm: CausalDiscoveryAlgorithm,
): Promise<CausalDiscoveryResult> {
	if (algorithm === CausalDiscoveryAlgorithm.None) {
		return {
			graph: { variables, relationships: [], constraints, algorithm },
			causalInferenceModel: null,
		}
	}

	/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
	const columns = variables.map(v => v.columnName)
	const jsonData = dataset.table.toJSON({ columns })
	const constraintsJson = createConstraintsJson(variables, constraints)
	const algorithmName =
		CausalDiscoveryAlgorithmOptions.get(algorithm)?.algorithm || algorithm
	const algorithmOptions =
		CausalDiscoveryAlgorithmOptions.get(algorithm)?.options
	const result = await fetch(
		`${RUN_CAUSAL_DISCOVERY_BASE_URL}${algorithmName.toLowerCase()}/`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				dataset: JSON.parse(jsonData),
				constraints: constraintsJson,
				deciOptions: algorithmOptions,
			}),
		},
	)
	const causalDiscoveryResult = await result.json()
	const graph = fromCausalDiscoveryResults(
		variables,
		causalDiscoveryResult as CausalDiscoveryRequestReturnValue,
		constraints,
		algorithm,
	)
	let causalInferenceModel: CausalInferenceModel | null = null
	if (causalDiscoveryResult.onnx) {
		const onnx = Uint8Array.from(atob(causalDiscoveryResult.onnx), c =>
			c.charCodeAt(0),
		)
		const inferenceSession = await ort.InferenceSession.create(onnx)
		const confidenceMatrix = new ort.Tensor(
			'float32',
			causalDiscoveryResult.confidence_matrix.flat(),
			[columns.length, columns.length],
		)
		const treatmentEffectMatrix = new ort.Tensor(
			'float32',
			causalDiscoveryResult.ate_matrix.flat(),
			[columns.length, columns.length],
		)

		const columnNames = causalDiscoveryResult.columns
		const isBooleanInterpretedAsContinuous =
			causalDiscoveryResult.interpret_boolean_as_continuous
		causalInferenceModel = {
			inferenceSession,
			confidenceMatrix,
			treatmentEffectMatrix,
			columnNames,
			isBooleanInterpretedAsContinuous,
		}
	}
	/* eslint-enable */

	return { graph, causalInferenceModel }
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
		forbiddenRelationships: constraints.forbiddenRelationships
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
