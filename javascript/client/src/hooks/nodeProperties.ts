/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	AlternativeModels,
	ElementDefinition,
	Estimator,
} from '@showwhy/types'
import { CausalModelLevel } from '@showwhy/types'
import { useMemo } from 'react'

import { useAlternativeModels } from '~hooks'
import {
	useConfidenceInterval,
	useEstimators,
	useExperiment,
	useRefutationCount,
} from '~state'

export function useNodeProperties(): {
	fileName?: string
	definitions: ElementDefinition[]
	estimators: Estimator[]
	refutationCount: number
	confidenceInterval: boolean
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
} {
	const experiment = useExperiment()
	const estimators = useEstimators()
	const refutationCount = useRefutationCount()
	const confidenceInterval = useConfidenceInterval()
	const maximumLevel = useAlternativeModels(CausalModelLevel.Maximum, false)
	const intermediateLevel = useAlternativeModels(
		CausalModelLevel.Intermediate,
		false,
	)
	const minimumModel = useAlternativeModels(CausalModelLevel.Minimum, false)
	const unadjustedModel = useAlternativeModels(
		CausalModelLevel.Unadjusted,
		false,
	)
	return useMemo(() => {
		return {
			definitions: experiment?.definitions || [],
			estimators,
			refutationCount,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		}
	}, [
		experiment,
		estimators,
		refutationCount,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	])
}
