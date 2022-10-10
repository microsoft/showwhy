/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import { useConfidenceIntervalResponse } from '../../state/confidenceIntervalResponse.js'
import { useEstimateEffectResponse } from '../../state/estimateEffectResponse.js'
import { useRefutationResponse } from '../../state/refutationResponse.js'
import { useShapResponse } from '../../state/shapResponse.js'
import type { EstimateData } from '../../types/api/EstimateData.js'
import type { Refutation } from '../../types/api/RefutationStatus.js'
import type { ShapStatus } from '../../types/api/ShapStatus.js'
import type { Maybe } from '../../types/primitives.js'
import { check_refutation_result } from '../../utils/refutationResult.js'
import { useReturnDefaultResponse } from '../defaultResponses.js'
import { useDefaultRun } from '../runHistory.js'
import type { ConfidenceIntervalStatus } from './../../types/api/ConfidenceIntervalStatus.js'
import type { EstimateEffectStatus } from './../../types/api/EstimateEffectStatus.js'
import type { RefutationStatus } from './../../types/api/RefutationStatus.js'

export function useEstimateData(): Maybe<EstimateData[]> {
	const defaultRun = useDefaultRun()
	const estimateEffectResponse = useEstimateEffectResponse()
	const defaultEstimateResponse =
		useReturnDefaultResponse<EstimateEffectStatus>(
			estimateEffectResponse,
			defaultRun?.id,
		)
	const confidenceIntervalResponse = useConfidenceIntervalResponse()
	const confidenceInterval = useReturnDefaultResponse<ConfidenceIntervalStatus>(
		confidenceIntervalResponse,
		defaultRun?.id,
	)
	const refutationResponse = useRefutationResponse()
	const refutation = useReturnDefaultResponse<RefutationStatus>(
		refutationResponse,
		defaultRun?.id,
	)
	const shapResponse = useShapResponse()
	const shap = useReturnDefaultResponse<ShapStatus>(
		shapResponse,
		defaultRun?.id,
	)
	return useMemo(() => {
		return defaultEstimateResponse?.results?.map(effect => {
			const _confidence = confidenceInterval?.results?.find(
				a => a.estimate_id === effect.id,
			)
			const _refutations = refutation?.results?.filter(
				a => a.estimate_id === effect.id,
			)
			const _shap =
				shap?.results?.length &&
				shap?.results[0]?.find(a => a.estimate_id === effect.id)
			let _refutation: any = {} // eslint-disable-line
			if (_refutations) {
				_refutations.forEach((a: Refutation) => {
					_refutation[a.refuter] = a.result // eslint-disable-line
				})
				_refutation = check_refutation_result(_refutation) // eslint-disable-line
			}

			const row = {
				...effect,
				..._refutation,
				..._shap,
				task_id: effect.id,
				upper_bound: _confidence?.upper_bound,
				lower_bound: _confidence?.lower_bound,
				covariate_balance: JSON.stringify(effect.covariate_balance),
			} as EstimateData
			delete row.id
			delete row.estimate_id
			return row
		})
	}, [defaultEstimateResponse, confidenceInterval, refutation, shap])
}
