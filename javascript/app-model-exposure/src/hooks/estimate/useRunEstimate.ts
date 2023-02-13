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
import { useSetRunHistory } from '../../state/runHistory.js'
import { useSetShapResponse } from '../../state/shapResponse.js'
import type { ConfidenceIntervalRequest } from '../../types/api/ConfidenceIntervalRequest.js'
import type { EstimateEffectRequest } from '../../types/api/EstimateEffectRequest.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import type { ShapStatus } from '../../types/api/ShapStatus.js'
import type { StatusResponse } from '../../types/api/StatusResponse.js'
import type { RunHistory } from '../../types/runs/RunHistory.js'
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
	signal?: AbortSignal,
): (estimateProps: EstimateEffectRequest) => Promise<void> {
	return useRun(finishLoading, undefined, signal)
}

function runSuccessful(status: NodeResponseStatus) {
	if (!isStatus(status, NodeResponseStatus.Success)) {
		return false
	}
	return true
}

export function useRun(
	finishLoading?: () => void,
	run?: RunHistory,
	signal?: AbortSignal,
) {
	const completeRun = useCompleteRun()
	const createRun = useSaveNewRun()
	const setEstimateEffectResponse = useSetEstimateEffectResponse()
	const newResponse = useSaveNewResponse<EstimateEffectStatus>(
		setEstimateEffectResponse,
	)
	const shapRun = useShapRun(signal)
	const updateStatus = useUpdateStatus(newResponse)
	return useCallback(
		async (estimateProps: EstimateEffectRequest, taskId?: string) => {
			const execution = taskId
				? { id: taskId }
				: await api.executeEstimate(estimateProps)
			const runHistory = run ?? createRun(execution.id, api.project)

			finishLoading?.()
			const response = await checkStatus({
				taskId: execution.id,
				type: ApiType.EstimateEffect,
				updateFn: updateStatus,
				signal,
			})
			runSuccessful(response.status)
				? void shapRun(
						runHistory?.estimators.some((x) => x.confidenceInterval),
						execution.id,
						response,
				  )
				: completeRun(response.status, execution.id, response)
		},
		[run, createRun, finishLoading, shapRun, completeRun, updateStatus, signal],
	)
}

export function useShapRun(signal?: AbortSignal) {
	const completeRun = useCompleteRun()
	const setShapResponse = useSetShapResponse()
	const newResponse = useSaveNewResponse<ShapStatus>(setShapResponse)
	const confidenceRun = useConfidenceRun(signal)
	const refutationRun = useRefutationRun(signal)
	const updateStatus = useUpdateStatus(newResponse)

	return useCallback(
		async (
			hasConfidenceInterval: boolean,
			taskId: string,
			estimateResponse?: EstimateEffectStatus,
			prevTaskId?: string,
		) => {
			const urlType = ApiType.ShapInterpreter
			const execution = prevTaskId
				? { id: prevTaskId }
				: await api.executeValidation(taskId, urlType)
			const response = await checkStatus({
				taskId: execution.id,
				type: urlType,
				signal,
			})
			updateStatus(taskId, response)

			if (runSuccessful(response.status)) {
				hasConfidenceInterval
					? void confidenceRun(taskId, estimateResponse?.results)
					: void refutationRun(taskId, estimateResponse?.results)
			} else {
				completeRun(response.status, execution.id)
			}
		},
		[completeRun, updateStatus, confidenceRun, refutationRun, signal],
	)
}

export function useConfidenceRun(signal?: AbortSignal) {
	const estimators = useEstimators()
	const completeRun = useCompleteRun()
	const setConfidenceResponse = useSetConfidenceIntervalResponse()
	const newResponse = useSaveNewResponse<ConfidenceIntervalStatus>(
		setConfidenceResponse,
	)
	const refutationRun = useRefutationRun(signal)
	const updateStatus = useUpdateStatus(newResponse)

	return useCallback(
		async (
			taskId: string,
			estimatedEffect?: EstimatedEffect[],
			prevTaskId?: string,
		) => {
			const ids = returnConfidenceIntervalMapping(estimatedEffect, estimators)

			const body = {
				estimate_execution_ids: ids,
			} as ConfidenceIntervalRequest
			const urlType = ApiType.ConfidenceInterval
			const execution = prevTaskId
				? { id: prevTaskId }
				: await api.executeValidation(taskId, urlType, body)
			const response = await checkStatus({
				taskId: execution.id,
				type: urlType,
				updateFn: updateStatus,
				_updateId: taskId,
				signal,
			})
			runSuccessful(response.status)
				? void refutationRun(taskId, estimatedEffect)
				: completeRun(response.status, execution.id)
		},
		[updateStatus, refutationRun, completeRun, estimators, signal],
	)
}

export function useRefutationRun(signal?: AbortSignal) {
	const estimators = useEstimators()
	const completeRun = useCompleteRun()
	const setRefutationResponse = useSetRefutationResponse()
	const newResponse = useSaveNewResponse<RefutationStatus>(
		setRefutationResponse,
	)
	const updateStatus = useUpdateStatus(newResponse)

	return useCallback(
		async (
			taskId: string,
			estimatedEffect?: EstimatedEffect[],
			prevTaskId?: string,
		) => {
			const mapping = returnRefutationMapping(estimatedEffect, estimators)

			const body = {
				num_simulations_map: Object.fromEntries(mapping),
			} as RefutationRequest
			const urlType = ApiType.RefuteEstimate
			const execution = prevTaskId
				? { id: prevTaskId }
				: await api.executeValidation(taskId, urlType, body)
			const response = await checkStatus({
				taskId: execution.id,
				type: urlType,
				updateFn: updateStatus,
				_updateId: taskId,
				signal,
			})
			completeRun(response.status, taskId)
		},
		[estimators, completeRun, updateStatus, signal],
	)
}

function useUpdateStatus(
	cb: (taskId: string, response: StatusResponse) => void,
) {
	const setRunHistory = useSetRunHistory()
	return useCallback(
		(taskId: string, response: StatusResponse) => {
			setRunHistory((prev) => {
				const existing = prev.find((p) => p.id === taskId)

				const newRun = {
					...existing,
					error: undefined,
					taskId,
					time: {
						start: existing?.time.start,
						end: new Date(),
					},
					status: response.status,
				} as RunHistory
				return [
					...prev.filter((p) => p.id !== existing?.id),
					newRun,
				] as RunHistory[]
			})
			cb(taskId, response)
		},
		[setRunHistory, cb],
	)
}
