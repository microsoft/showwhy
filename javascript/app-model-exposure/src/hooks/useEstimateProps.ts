/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import { buildAlternativeModels } from '../builders/buildAlternativeModels.js'
import { buildEstimators } from '../builders/buildEstimators.js'
import { buildSpecs } from '../builders/buildSpecs.js'
import type { EstimateEffectRequest } from '../types/api/EstimateEffectRequest.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import type { Maybe } from '../types/primitives.js'
import { getDefinitionsByType } from '../utils/definition.js'
import { useNodeProperties } from './nodeProperties.js'

export function useEstimateProps(
	fileName?: string,
): Maybe<EstimateEffectRequest> {
	const getNodeProperties = useGetNodeProperties()
	return useMemo(() => {
		if (!fileName) {
			return undefined
		}
		return getNodeProperties(fileName)
	}, [fileName, getNodeProperties])
}

function useGetNodeProperties(): (fileName: string) => EstimateEffectRequest {
	const {
		definitions,
		estimators,
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

			const properties = {
				...buildSpecs(fileName, population, exposure, outcome),
				model_specs: buildAlternativeModels(
					maximumLevel,
					minimumModel,
					intermediateLevel,
					unadjustedModel,
				),
				estimator_specs: buildEstimators([...estimators]),
			}
			return properties
		},
		[
			definitions,
			estimators,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		],
	)
}
