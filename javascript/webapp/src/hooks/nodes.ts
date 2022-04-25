/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	buildAlternativeModels,
	buildEstimators,
	buildNodes,
	buildRefutationSpecs,
	buildSpecs,
} from '@showwhy/builders'
import type { GraphNodeData, Maybe, NodeRequest } from '@showwhy/types'
import { DefinitionType, GraphNodeType } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { getDefinitionsByType } from '~utils'

import { useNodeProperties } from './nodeProperties'

export function useEstimateNode(fileName?: string): Maybe<NodeRequest> {
	const getNodeProperties = useGetNodeProperties()
	return useMemo(() => {
		if (!fileName) {
			return undefined
		}
		return buildEstimateEffectNode(getNodeProperties(fileName))
	}, [fileName, getNodeProperties])
}

function useGetNodeProperties(): (fileName: string) => Partial<GraphNodeData> {
	const {
		definitions,
		estimators,
		refutationCount,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	} = useNodeProperties()

	return useCallback(
		(fileName: string) => {
			const population = getDefinitionsByType(
				DefinitionType.Population,
				definitions,
			)
			const exposure = getDefinitionsByType(
				DefinitionType.Exposure,
				definitions,
			)
			const outcome = getDefinitionsByType(DefinitionType.Outcome, definitions)
			const [dataframeName] = fileName.split('.')

			const properties = {
				...buildSpecs(dataframeName!, population, exposure, outcome),
				model_specs: buildAlternativeModels(
					maximumLevel,
					minimumModel,
					intermediateLevel,
					unadjustedModel,
				),
				estimator_specs: buildEstimators([...estimators]),
				refuter_specs: buildRefutationSpecs(refutationCount),
				confidence_interval: confidenceInterval,
			}
			return properties
		},
		[
			definitions,
			estimators,
			refutationCount,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		],
	)
}

function buildEstimateEffectNode(
	nodeProperties: Partial<GraphNodeData>,
): NodeRequest {
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.EstimateEffects,
			...nodeProperties,
		},
	])
	return nodeReq
}
