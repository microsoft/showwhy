/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'

import { isProcessingStatus, isStatus } from '../api-client/utils.js'
import { useConfounderThreshold } from '../state/confounderThreshold.js'
import { useEstimators } from '../state/estimators.js'
import { useRunHistory, useSetRunHistory } from '../state/runHistory.js'
import { useSpecCount } from '../state/specCount.js'
import { useResetSpecificationCurveConfig } from '../state/specificationCurveConfig.js'
import type { ExecutionResponse } from '../types/api/ExecutionResponse.js'
import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { StatusResponse } from '../types/api/StatusResponse.js'
import type { Estimator } from '../types/estimators/Estimator.js'
import type { Maybe } from '../types/primitives.js'
import type { RunHistory } from '../types/runs/RunHistory.js'
import type { SpecificationCount } from './../types/api/SpecificationCount.js'
import { EstimatorGroup } from './../types/estimators/EstimatorGroup.js'

export function useSetRunAsDefault(): (run: RunHistory) => void {
	const setRunHistory = useSetRunHistory()
	const resetSpecificationConfig = useResetSpecificationCurveConfig()
	const runHistory = useRunHistory()

	return useCallback(
		(run: RunHistory) => {
			if (!runHistory.length) {
				return
			}
			const runs = disableAllRuns(runHistory).filter((r) => r.id !== run.id)
			const newRun = { ...run, isActive: true }
			runs.push(newRun)
			setRunHistory(runs)
			resetSpecificationConfig()
			// setStorageItem(SESSION_ID_KEY, newRun.sessionId as string)
		},
		[runHistory, setRunHistory, resetSpecificationConfig],
	)
}

export function useDefaultRun(): Maybe<RunHistory> {
	const runHistory = useRunHistory()

	return useMemo(() => {
		if (!runHistory.length) return undefined
		return runHistory.find((x) => x.isActive)
	}, [runHistory])
}

export function useIsDefaultRunProcessing(): boolean {
	const defaultRun = useDefaultRun()

	return useMemo(() => {
		return (
			isProcessingStatus(defaultRun?.status as NodeResponseStatus) ||
			defaultRun?.completed === false
		)
	}, [defaultRun])
}

export function useSaveNewRun(): (id: string, project: string) => RunHistory {
	const confounderThreshold = useConfounderThreshold()
	const runHistory = useRunHistory()
	const specCount = useSpecCount()
	const updateRunHistory = useUpdateAndDisableRunHistory()
	const estimators = useEstimators()

	return useCallback(
		(id: string, project: string) => {
			const initialRun = initialRunHistory(
				id,
				estimators,
				runHistory.length,
				confounderThreshold,
				project,
				specCount,
			)
			updateRunHistory(initialRun)
			return initialRun
		},
		[
			estimators,
			specCount,
			updateRunHistory,
			runHistory.length,
			confounderThreshold,
		],
	)
}

export function useUpdateExecutionId(): (response?: ExecutionResponse) => void {
	const setRunHistory = useSetRunHistory()
	return useCallback(
		(response) => {
			setRunHistory((prev) => {
				const existing = prev.find((p) => p.isActive) as RunHistory
				const newOne = {
					...existing,
					response: response?.id,
				}
				return [
					...prev.filter((p) => p.id !== existing.id),
					newOne,
				] as RunHistory[]
			})
		},
		[setRunHistory],
	)
}

export function useCompleteRun(): (
	status: NodeResponseStatus,
	taskId: string,
	{ error }?: StatusResponse,
) => void {
	const setRunHistory = useSetRunHistory()

	return useCallback(
		(status, taskId, { error } = {} as StatusResponse) => {
			setRunHistory((prev) => {
				const existing = prev.find((p) => p.id === taskId)

				const newOne = {
					...existing,
					error: undefined,
					taskId,
					time: {
						start: existing?.time.start,
						end: new Date(),
					},
					status,
					completed: true,
				} as RunHistory

				if (
					isStatus(status, NodeResponseStatus.Failure) ||
					isStatus(status, NodeResponseStatus.Error)
				) {
					newOne.error = error ?? 'Undefined error. Please try again.'
				}

				return [
					...prev.filter((p) => p.id !== existing?.id),
					newOne,
				] as RunHistory[]
			})
		},
		[setRunHistory],
	)
}

export function useUpdateAndDisableRunHistory(): (
	runHistory: RunHistory,
) => void {
	const setRunHistory = useSetRunHistory()
	return useCallback(
		(runHistory: RunHistory) => {
			setRunHistory((prev) => [
				...prev
					.filter((p) => p.id !== runHistory.id)
					.map((x) => {
						return { ...x, isActive: false }
					}),
				runHistory,
			])
		},
		[setRunHistory],
	)
}

export function disableAllRuns(runHistory: RunHistory[]): RunHistory[] {
	return runHistory.map((run) => {
		return { ...run, isActive: false }
	})
}

function initialRunHistory(
	id: string,
	estimators: Estimator[],
	runHistoryLength: number,
	confounderThreshold: number,
	project: string,
	specCount: Maybe<SpecificationCount>,
): RunHistory {
	const exposure = estimators.some(
		(e) => e.group === EstimatorGroup.Exposure && e.confidenceInterval,
	)
		? 1
		: 0
	const outcome = estimators.some(
		(e) => e.group === EstimatorGroup.Outcome && e.confidenceInterval,
	)
		? 1
		: 0
	const confidenceIntervalCount =
		(specCount?.treatment.count ?? 0) * exposure +
		(specCount?.outcome.count ?? 0) * outcome

	return {
		runNumber: runHistoryLength + 1,
		isActive: true,
		status: NodeResponseStatus.Started,
		time: {
			start: new Date(),
		},
		id,
		specCount: specCount?.total,
		confidenceIntervalCount,
		project,
		estimators,
		confounderThreshold,
		completed: false,
	} as RunHistory
}
