/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'
import { useAlternativeModels } from '~hooks'
import {
	useConfidenceInterval,
	useExperiment,
	useEstimators,
	useRefutationType,
} from '~state'
import {
	AlternativeModels,
	Experiment,
	Estimator,
	RefutationType,
	CausalModelLevel,
} from '~types'

export function useNodeProperties(): {
	fileName?: string
	definitions: Experiment
	estimators: Estimator[]
	refutationType: RefutationType
	confidenceInterval: boolean
	maximumLevel: AlternativeModels
	minimumModel: AlternativeModels
	intermediateLevel: AlternativeModels
	unadjustedModel: AlternativeModels
} {
	const definitions = useExperiment()
	const estimators = useEstimators()
	const refutationType = useRefutationType()
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
			definitions,
			estimators,
			refutationType,
			confidenceInterval,
			maximumLevel,
			minimumModel,
			intermediateLevel,
			unadjustedModel,
		}
	}, [
		definitions,
		estimators,
		refutationType,
		confidenceInterval,
		maximumLevel,
		minimumModel,
		intermediateLevel,
		unadjustedModel,
	])
}
