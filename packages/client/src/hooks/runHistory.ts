/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { fromCSV } from 'arquero'
import { RowObject } from 'arquero/dist/types/table/table'
import { useCallback, useMemo } from 'react'
import { DownloadType, NodeResponseStatus } from '~enums'
import { useRefutationCount, useReturnResult } from '~hooks'
import { CheckStatus, RunHistory, RunStatus } from '~interfaces'
import { getSessionId } from '~resources'
import {
	useResetSpecificationCurveConfig,
	useRunHistory,
	useSetRunHistory,
} from '~state'
import { findRunError, returnPercentage } from '~utils'

export function useSetRunAsDefault(): (runId: string) => void {
	const setRunHistory = useSetRunHistory()
	const resetSpecificationConfig = useResetSpecificationCurveConfig()

	return useCallback(
		(runId: string) => {
			setRunHistory(prev => {
				const actual = { ...prev.find(x => x.id === runId) } as RunHistory
				actual.isActive = true
				const old = prev
					.filter(x => x.id !== runId)
					.map(x => {
						return { ...x, isActive: false }
					})
				return [...old, actual]
			})
			resetSpecificationConfig()
		},
		[setRunHistory, resetSpecificationConfig],
	)
}

const returnStatus = (
	response: Partial<CheckStatus>,
	hasConfidenceInterval: boolean,
	totalRefuters: number,
): RunStatus => {
	const estimators = {
		status:
			!!response?.estimated_effect_completed &&
			response?.estimated_effect_completed === response?.total_results
				? NodeResponseStatus.Completed
				: NodeResponseStatus.Running,
	}
	const confidenceIntervals = {
		status:
			!!response?.confidence_interval_completed &&
			response?.confidence_interval_completed === response?.total_results
				? NodeResponseStatus.Completed
				: estimators.status === NodeResponseStatus.Completed
				? NodeResponseStatus.Running
				: NodeResponseStatus.Idle,
	}
	const refuters = {
		status:
			(!!response?.refute_completed &&
				response?.refute_completed === response?.total_results) ||
			0 * totalRefuters
				? NodeResponseStatus.Completed
				: (
						hasConfidenceInterval
							? confidenceIntervals.status === NodeResponseStatus.Completed
							: estimators.status === NodeResponseStatus.Completed
				  )
				? NodeResponseStatus.Running
				: NodeResponseStatus.Idle,
	}

	let percentage = 100

	response.total_results = response?.total_results ?? 1
	response.estimated_effect_completed =
		response?.estimated_effect_completed ?? 0
	response.confidence_interval_completed =
		response?.confidence_interval_completed ?? 0
	response.refute_completed = response?.refute_completed ?? 0

	if (estimators.status !== NodeResponseStatus.Completed) {
		percentage = returnPercentage(
			response?.estimated_effect_completed,
			response?.total_results,
		)
	} else if (
		hasConfidenceInterval &&
		confidenceIntervals.status !== NodeResponseStatus.Completed
	) {
		percentage = returnPercentage(
			response?.confidence_interval_completed,
			response?.total_results,
		)
	} else if (refuters.status !== NodeResponseStatus.Completed) {
		percentage = returnPercentage(response?.refute_completed, totalRefuters)
	}

	return response.partial_results
		? {
				status: response.runtimeStatus?.toLowerCase() as NodeResponseStatus,
				error: findRunError(response),
				estimated_effect_completed: `${response.estimated_effect_completed}/${response.total_results}`,
				confidence_interval_completed: `${response.confidence_interval_completed}/${response.total_results}`,
				refute_completed: `${response?.refute_completed}/${totalRefuters}`,
				percentage,
				estimators,
				confidenceIntervals,
				refuters,
		  }
		: ({
				status: response.runtimeStatus,
				error: findRunError(response),
				estimators,
				confidenceIntervals,
				refuters,
		  } as RunStatus)
}

export function useDefaultRun(): RunHistory | undefined {
	const runHistory = useRunHistory()

	return useMemo(() => {
		if (!runHistory.length) return undefined
		return runHistory.find(x => x.isActive)
	}, [runHistory])
}

export function useUpdateRunHistory(): (
	id: string,
	response: CheckStatus,
	result?: RowObject[] | null,
) => void {
	const setRunHistory = useSetRunHistory()
	const getRefutationCount = useRefutationCount()

	return useCallback(
		(id, response, result) => {
			setRunHistory(prev => {
				const existing = prev.find(p => p.id === id) as RunHistory
				const refutationCount = getRefutationCount(response.total_results)
				let status = returnStatus(
					response,
					existing.hasConfidenceInterval,
					refutationCount,
				)
				const start = existing?.status?.time?.start || 0
				const time = {
					start,
					end: new Date(),
				}
				status = !status.percentage
					? ({
							...existing.status,
							...status,
							time,
					  } as RunStatus)
					: ({
							...status,
							time,
					  } as RunStatus)
				return [
					...prev.filter(p => p.id !== id),
					{ ...existing, status, result: result || existing.result },
				] as RunHistory[]
			})
		},
		[setRunHistory],
	)
}

function useProcessError(): (res: CheckStatus, id: string) => boolean {
	const updateRunHistory = useUpdateRunHistory()

	return useCallback(
		(res: CheckStatus, id: string): boolean => {
			updateRunHistory(id, res)
			return true
		},
		[updateRunHistory],
	)
}

export function useGetReady(): (id: string, res: CheckStatus) => Promise<void> {
	const updateRunHistory = useUpdateRunHistory()
	const processError = useProcessError()

	return useCallback(
		async (id: string, res: CheckStatus) => {
			if (
				res.runtimeStatus.toLowerCase() === NodeResponseStatus.Error ||
				res.runtimeStatus.toLowerCase() === NodeResponseStatus.Failed
			) {
				processError(res, id)
				return
			}
			updateRunHistory(id, res, res.partial_results)
		},
		[processError, updateRunHistory],
	)
}
