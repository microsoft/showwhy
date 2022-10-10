/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import { isStatus } from '../api-client/utils.js'
import { DEFAULT_REFUTATION_TESTS } from '../constants.js'
import { useConfidenceIntervalResponse } from '../state/confidenceIntervalResponse.js'
import { useEstimateEffectResponse } from '../state/estimateEffectResponse.js'
import { useRefutationResponse } from '../state/refutationResponse.js'
import { useShapResponse } from '../state/shapResponse.js'
import type { ConfidenceIntervalStatus } from '../types/api/ConfidenceIntervalStatus.js'
import type { EstimateEffectStatus } from '../types/api/EstimateEffectStatus.js'
import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { RefutationStatus } from '../types/api/RefutationStatus.js'
import type { ShapStatus } from '../types/api/ShapStatus.js'
import type { Maybe } from '../types/primitives.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { RunStatus } from '../types/runs/RunStatus.js'
import { percentage as calcPercent } from '../utils/stats.js'
import { useReturnDefaultResponse } from './defaultResponses.js'

export function useGetRunStatus(defaultRun: Maybe<RunHistory>): RunStatus {
	const estimateEffectResponse = useEstimateEffectResponse()
	const estimators = useReturnDefaultResponse<EstimateEffectStatus>(
		estimateEffectResponse,
		defaultRun?.id,
	)
	const confidenceIntervalResponse = useConfidenceIntervalResponse()
	const confidenceInterval = useReturnDefaultResponse<ConfidenceIntervalStatus>(
		confidenceIntervalResponse,
		defaultRun?.id,
	)
	const refutationResponse = useRefutationResponse()
	const refuters = useReturnDefaultResponse<RefutationStatus>(
		refutationResponse,
		defaultRun?.id,
	)
	const shapResponse = useShapResponse()
	const shap = useReturnDefaultResponse<ShapStatus>(
		shapResponse,
		defaultRun?.id,
	)

	return useMemo(() => {
		const status = {
			status: defaultRun?.status,
			percentage: 100,
		} as RunStatus

		const totalResults = defaultRun?.specCount ?? 0

		status.estimated_effect_completed = estimators?.completed ?? 0
		status.refute_completed = Math.ceil(
			(refuters?.completed || 0) / DEFAULT_REFUTATION_TESTS.length,
		)
		status.confidence_interval_completed = confidenceInterval?.completed ?? 0
		status.confidence_interval_pending = confidenceInterval?.pending ?? 0

		if (!isStatus(estimators?.status, NodeResponseStatus.Success)) {
			status.percentage = calcPercent(
				status.estimated_effect_completed,
				totalResults,
			)
		} else if (!isStatus(shap?.status, NodeResponseStatus.Success)) {
			status.percentage = 99
		} else if (
			defaultRun?.estimators.some(e => e.confidenceInterval) &&
			!isStatus(confidenceInterval?.status, NodeResponseStatus.Success)
		) {
			status.percentage = calcPercent(
				status.confidence_interval_completed,
				totalResults,
			)
		} else if (!isStatus(refuters?.status, NodeResponseStatus.Success)) {
			status.percentage = calcPercent(status.refute_completed, totalResults)
		}

		return status
	}, [defaultRun, estimators, refuters, confidenceInterval, shap])
}
