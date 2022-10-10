/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalVariable } from './CausalVariable.js'
import { VariableNature } from './VariableNature.js'

declare const ort: any

export interface CausalInferenceModel {
	inferenceSession: any // ort.InferenceSession
	confidenceMatrix: any // ort.Tensor('float32',..., [columns.length, columns.length]);
	treatmentEffectMatrix: any // ort.Tensor('float32',..., [columns.length, columns.length]);
	columnNames: string[]
	isBooleanInterpretedAsContinuous: boolean
}

export interface Intervention {
	columnName: string
	value: number
}

export async function runCausalInference(
	model: CausalInferenceModel,
	confidenceThreshold: number,
	weightThreshold: number,
	variables: CausalVariable[],
	initialValueOffsets: Map<string, number> = new Map(),
	interventions: Intervention[] = [],
): Promise<Map<string, number>> {
	const initialValuesArray = model.columnNames.map(columnName => {
		const initialValueForColumn = initialValueOffsets.get(columnName)
		return initialValueForColumn === undefined ? 0 : initialValueForColumn
	})

	const interventionValues: number[] = []
	const interventionMask = model.columnNames.map(columnName => {
		const interventionForColumn = interventions.find(
			intervention => intervention.columnName === columnName,
		)
		if (interventionForColumn) {
			interventionValues.push(interventionForColumn.value)
			return true
		}

		return false
	})

	const X = new ort.Tensor('float32', initialValuesArray, [
		1,
		model.columnNames.length,
	])

	// const thresholdedAdjacencyData = model.adjacencyMatrix.data.map((datum: number) => datum > confidenceThreshold ? datum : 0);
	// const W_adj = new ort.Tensor('float32', thresholdedAdjacencyData, model.adjacencyMatrix.dims);

	const binaraziedAdjacencyData = model.confidenceMatrix.data.map(
		(datum: number, i: number) =>
			(datum > confidenceThreshold ? 1 : 0) &&
			(Math.abs(model.treatmentEffectMatrix.data[i]) > weightThreshold ? 1 : 0),
	)
	const W_adj = new ort.Tensor(
		'float32',
		binaraziedAdjacencyData,
		model.confidenceMatrix.dims,
	)

	const intervention_mask = new ort.Tensor('bool', interventionMask)
	const intervention_values = new ort.Tensor('float32', interventionValues)

	const gumbel_max_regions = new ort.Tensor('int64', []) // Categorical...
	const binaryColumns = model.columnNames
		.map((columnName, index) =>
			variables.find(v => v.columnName === columnName)?.nature ===
			VariableNature.Binary
				? BigInt(index)
				: -1,
		)
		.filter(v => v >= 0)
	const gt_zero_region = new ort.Tensor(
		'int64',
		model.isBooleanInterpretedAsContinuous ? [] : binaryColumns,
	)

	// prepare feeds. use model input names as keys.
	const feeds = {
		X,
		W_adj,
		intervention_mask,
		intervention_values,
		gumbel_max_regions,
		gt_zero_region,
	}

	// feed inputs and run
	const results = await model.inferenceSession.run(feeds)
	const resultMap = new Map<string, number>()
	model.columnNames.forEach((columnName, i) => {
		resultMap.set(columnName, results.inference_results.data[i])
	})
	// console.log('Ran causal inference! ', resultMap.entries());
	return resultMap
}
