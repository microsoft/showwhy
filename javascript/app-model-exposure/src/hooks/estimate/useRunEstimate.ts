/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { ApiType } from '../../api-client/FetchApiInteractor.types.js'
import { checkStatus } from '../../api-client/FetchApiInteractor.utils.js'
import { isStatus } from '../../api-client/utils.js'
import { api } from '../../resources/api.js'
import { useSetConfidenceIntervalResponse } from '../../state/confidenceIntervalResponse.js'
import { useSetEstimateEffectResponse } from '../../state/estimateEffectResponse.js'
import { useEstimators } from '../../state/estimators.js'
import { useSetRefutationResponse } from '../../state/refutationResponse.js'
import { useSetShapResponse } from '../../state/shapResponse.js'
import type { ConfidenceIntervalRequest } from '../../types/api/ConfidenceIntervalRequest.js'
import type { EstimateEffectRequest } from '../../types/api/EstimateEffectRequest.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import type { ShapStatus } from '../../types/api/ShapStatus.js'
import { returnConfidenceIntervalMapping } from '../../utils/confidenceIntervalRequest.js'
import { returnRefutationMapping } from '../../utils/refutationRequest.js'
import { useSaveNewResponse } from '../defaultResponses.js'
import { useCompleteRun, useSaveNewRun } from '../runHistory.js'
import type { ConfidenceIntervalStatus } from './../../types/api/ConfidenceIntervalStatus.js'
import type {
	EstimatedEffect,
	EstimateEffectStatus,
} from './../../types/api/EstimateEffectStatus.js'
import type { RefutationRequest } from './../../types/api/RefutationRequest.js'
import type { RefutationStatus } from './../../types/api/RefutationStatus.js'

export function useRunEstimate(
	finishLoading: () => void,
): (estimateProps: EstimateEffectRequest) => Promise<void> {
	const completeRun = useCompleteRun()
	const setEstimateEffectResponse = useSetEstimateEffectResponse()
	const newEstimateResponse = useSaveNewResponse<EstimateEffectStatus>(
		setEstimateEffectResponse,
	)
	const setConfidenceResponse = useSetConfidenceIntervalResponse()
	const newConfidenceResponse = useSaveNewResponse<ConfidenceIntervalStatus>(
		setConfidenceResponse,
	)
	const setRefutationResponse = useSetRefutationResponse()
	const newRefutationResponse = useSaveNewResponse<RefutationStatus>(
		setRefutationResponse,
	)
	const setShapResponse = useSetShapResponse()
	const newShapResponse = useSaveNewResponse<ShapStatus>(setShapResponse)
	const estimators = useEstimators()
	const createRun = useSaveNewRun()

	const refutationRun = useCallback(
		async (taskId: string, estimatedEffect?: EstimatedEffect[]) => {
			const mapping = returnRefutationMapping(estimatedEffect, estimators)

			const body = {
				num_simulations_map: Object.fromEntries(mapping),
			} as RefutationRequest
			const urlType = ApiType.RefuteEstimate
			const execution = await api.executeValidation(taskId, urlType, body)
			const response = await checkStatus(
				execution.id,
				urlType,
				newRefutationResponse,
				taskId,
			)
			completeRun(response.status, taskId)
		},
		[estimators, completeRun, newRefutationResponse],
	)

	const confidenceRun = useCallback(
		async (taskId: string, estimatedEffect?: EstimatedEffect[]) => {
			const ids = returnConfidenceIntervalMapping(estimatedEffect, estimators)

			const body = {
				estimate_execution_ids: ids,
			} as ConfidenceIntervalRequest
			const urlType = ApiType.ConfidenceInterval
			const execution = await api.executeValidation(taskId, urlType, body)
			const response = await checkStatus(
				execution.id,
				urlType,
				newConfidenceResponse,
				taskId,
			)
			runSuccessful(response.status)
				? void refutationRun(taskId, estimatedEffect)
				: completeRun(response.status, execution.id)
		},
		[newConfidenceResponse, refutationRun, completeRun, estimators],
	)

	const shapRun = useCallback(
		async (
			hasConfidenceInterval: boolean,
			taskId: string,
			estimateResponse: EstimateEffectStatus,
		) => {
			const urlType = ApiType.ShapInterpreter
			const execution = await api.executeValidation(taskId, urlType)
			const response = await checkStatus(execution.id, urlType)
			newShapResponse(taskId, response)

			if (runSuccessful(response.status)) {
				hasConfidenceInterval
					? void confidenceRun(taskId, estimateResponse.results)
					: void refutationRun(taskId, estimateResponse.results)
			} else {
				completeRun(response.status, execution.id)
			}
		},
		[completeRun, newShapResponse, confidenceRun, refutationRun],
	)

	const run = useCallback(
		async (estimateProps: EstimateEffectRequest) => {
			const execution = await api.executeEstimate(estimateProps)
			const runHistory = createRun(execution.id, api.project)
			finishLoading()
			const response = await checkStatus(
				execution.id,
				ApiType.EstimateEffect,
				newEstimateResponse,
			)
			runSuccessful(response.status)
				? void shapRun(
						runHistory.estimators.some((x) => x.confidenceInterval),
						execution.id,
						response,
				  )
				: completeRun(response.status, execution.id)
		},
		[newEstimateResponse, createRun, finishLoading, shapRun, completeRun],
	)

	return run
}

function runSuccessful(status: NodeResponseStatus) {
	if (!isStatus(status, NodeResponseStatus.Success)) {
		return false
	}
	return true
}
