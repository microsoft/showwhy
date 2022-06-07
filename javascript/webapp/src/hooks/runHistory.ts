/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isProcessingStatus } from '@showwhy/api-client'
import type {
	Handler,
	Maybe,
	NodeResponse,
	PartialResults,
	RunHistory,
	RunStatus,
} from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import { v4 } from 'uuid'

import {
	getStorageItem,
	SESSION_ID_KEY,
	setStorageItem,
	useConfidenceInterval,
	useConfounderThreshold,
	useCovariateProportionThreshold,
	useRefutationCount,
	useResetSpecificationCurveConfig,
	useRunHistory,
	useSetRunHistory,
	useSpecCount,
} from '~state'

export function useSetRunAsDefault(): (run: RunHistory) => void {
	const setRunHistory = useSetRunHistory()
	const resetSpecificationConfig = useResetSpecificationCurveConfig()
	const runHistory = useRunHistory()

	return useCallback(
		(run: RunHistory) => {
			if (!runHistory.length) {
				return
			}
			const runs = disableAllRuns(runHistory).filter(r => r.id !== run.id)
			const newRun = { ...run, isActive: true }
			runs.push(newRun)
			setRunHistory(runs)
			resetSpecificationConfig()
			setStorageItem(SESSION_ID_KEY, newRun.sessionId as string)
		},
		[runHistory, setRunHistory, resetSpecificationConfig],
	)
}

export function useDefaultRun(): Maybe<RunHistory> {
	const runHistory = useRunHistory()

	return useMemo(() => {
		if (!runHistory.length) return undefined
		return runHistory.find(x => x.isActive)
	}, [runHistory])
}

export function useIsDefaultRunProcessing(): boolean {
	const defaultRun = useDefaultRun()

	return useMemo(() => {
		return isProcessingStatus(defaultRun?.status?.status as NodeResponseStatus)
	}, [defaultRun])
}

export function useSaveNewRun(): Handler {
	const updateRunHistory = useUpdateAndDisableRunHistory()
	const hasConfidenceInterval = useConfidenceInterval()
	const confounderThreshold = useConfounderThreshold()
	const proportionThreshold = useCovariateProportionThreshold()
	const runHistory = useRunHistory()
	const specCount = useSpecCount()
	const refutationCount = useRefutationCount()

	return useCallback(() => {
		const initialRun = initialRunHistory(
			specCount as number,
			hasConfidenceInterval,
			refutationCount,
			runHistory.length,
			confounderThreshold,
			proportionThreshold,
		)
		updateRunHistory(initialRun)
	}, [
		updateRunHistory,
		specCount,
		hasConfidenceInterval,
		refutationCount,
		runHistory.length,
		confounderThreshold,
		proportionThreshold,
	])
}

export function useUpdateNodeResponseActiveRunHistory(): (
	nodeResponse?: NodeResponse,
) => void {
	const setRunHistory = useSetRunHistory()
	return useCallback(
		nodeResponse => {
			setRunHistory(prev => {
				const existing = prev.find(p => p.isActive) as RunHistory
				const newOne = {
					...existing,
					nodeResponse: nodeResponse || existing.nodeResponse,
				}
				return [
					...prev.filter(p => p.id !== existing.id),
					newOne,
				] as RunHistory[]
			})
		},
		[setRunHistory],
	)
}

export function useUpdateActiveRunHistory(): (
	newStatus?: RunStatus,
	result?: PartialResults[],
) => void {
	const setRunHistory = useSetRunHistory()
	return useCallback(
		(newStatus, result) => {
			setRunHistory(prev => {
				const existing = prev.find(p => p.isActive) as RunHistory
				const newOne = {
					...existing,
					status: {
						...existing.status,
						...newStatus,
						time: {
							start: existing?.status?.time?.start,
							end: newStatus?.time?.end,
						},
					},
					result: result || existing.result,
				}
				return [
					...prev.filter(p => p.id !== existing.id),
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
			setRunHistory(prev => [
				...prev
					.filter(p => p.id !== runHistory.id)
					.map(x => {
						return { ...x, isActive: false }
					}),
				runHistory,
			])
		},
		[setRunHistory],
	)
}

export function disableAllRuns(runHistory: RunHistory[]): RunHistory[] {
	return runHistory.map(run => {
		return { ...run, isActive: false }
	})
}

function initialRunHistory(
	specCount: number,
	hasConfidenceInterval: boolean,
	refutationCount: number,
	runHistoryLength: number,
	confounderThreshold: number,
	proportionThreshold: number,
): RunHistory {
	return {
		id: v4(),
		runNumber: runHistoryLength + 1,
		isActive: true,
		status: {
			status: NodeResponseStatus.Running,
			estimated_effect_completed: `0/${specCount}`,
			confidence_interval_completed: `0/${specCount}`,
			refute_completed: `0/${specCount}`,
			percentage: 0,
			time: {
				start: new Date(),
			},
		},
		sessionId: getStorageItem(SESSION_ID_KEY),
		hasConfidenceInterval,
		refutationCount,
		confounderThreshold,
		proportionThreshold,
	} as RunHistory
}
