/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	buildEstimators,
	buildNodes,
	buildRefutationSpecs,
	buildSpecs,
	models,
} from './builders'
import { NodeTypes } from '~enums'
import { useNodeProperties } from '~hooks'
import { AdditionalProperties, NodeRequest } from '~interfaces'

export function useGetNodeProperties(): (
	fileName: string,
) => AdditionalProperties {
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
				...buildSpecs(dataframeName, population, exposure, outcome),
				model_specs: models(
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

export const useBuildEstimateEffectNode = (): ((
	fileName: string,
) => NodeRequest) => {
	const getNodeProperties = useGetNodeProperties()
	return useCallback(
		(fileName: string) => {
			const nodeReq = buildNodes([
				{
					type: NodeTypes.EstimateEffects,
					...getNodeProperties(fileName),
				},
			])
			return nodeReq
		},
		[getNodeProperties],
	)
}
