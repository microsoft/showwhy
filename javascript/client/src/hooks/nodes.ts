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
import { GraphNodeType } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useNodeProperties } from './nodeProperties'

export function useEstimateNode(fileName?: string): Maybe<NodeRequest> {
	const buildEstimateEffectNode = useBuildEstimateEffectNode()
	return useMemo(() => {
		if (!fileName) {
			return undefined
		}
		return buildEstimateEffectNode(fileName)
	}, [fileName, buildEstimateEffectNode])
}

function useGetNodeProperties(): (fileName: string) => Partial<GraphNodeData> {
	const {
		definitions,
		estimators,
		refutationType,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	} = useNodeProperties()

	return useCallback(
		(fileName: string) => {
			const population = definitions?.population?.definition || []
			const exposure = definitions?.exposure?.definition || []
			const outcome = definitions?.outcome?.definition || []
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
				refuter_specs: buildRefutationSpecs(refutationType),
				confidence_interval: confidenceInterval,
			}
			return properties
		},
		[
			definitions,
			estimators,
			refutationType,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		],
	)
}

function useBuildEstimateEffectNode(): (fileName: string) => NodeRequest {
	const getNodeProperties = useGetNodeProperties()
	return useCallback(
		(fileName: string) => {
			const nodeReq = buildNodes([
				{
					type: GraphNodeType.EstimateEffects,
					...getNodeProperties(fileName),
				},
			])
			return nodeReq
		},
		[getNodeProperties],
	)
}
