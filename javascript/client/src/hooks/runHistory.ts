/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	NodeResponseStatus,
	NodeResponse,
	PartialResults,
	isProcessingStatus,
} from '@showwhy/api-client'
import { useCallback, useMemo } from 'react'
import {
	useResetSpecificationCurveConfig,
	useRunHistory,
	useSetRunHistory,
} from '~state'
import type { RunHistory, RunStatus } from '~types'
import { disableAllRuns, setStorageItem, SESSION_ID_KEY } from '~utils'
import type { Maybe } from '@showwhy/types'

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
