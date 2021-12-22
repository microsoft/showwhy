/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { v4 } from 'uuid'
import { NodeResponseStatus, RefutationTypes } from '~enums'
import { useRefutationCount } from '~hooks'
import { CheckStatus, RunHistory, RunStatus } from '~interfaces'
import {
	useResetSpecificationCurveConfig,
	useRunHistory,
	useSetRunHistory,
	useSpecCount,
} from '~state'
import {
	disableAllRuns,
	findRunError,
	isStatusProcessing,
	matchStatus,
	returnConfidenceIntervalsStatus,
	returnEstimatorStatus,
	returnPercentage,
	returnRefutersStatus,
} from '~utils'

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
		},
		[runHistory, setRunHistory, resetSpecificationConfig, disableAllRuns],
	)
}

export function useDefaultRun(): RunHistory | undefined {
	const runHistory = useRunHistory()

	return useMemo(() => {
		if (!runHistory.length) return undefined
		return runHistory.find(x => x.isActive)
	}, [runHistory])
}

export function useIsDefaultRunProcessing(): boolean {
	const defaultRun = useDefaultRun()

	return useMemo(() => {
		return isStatusProcessing(defaultRun?.status?.status as NodeResponseStatus)
	}, [defaultRun])
}

export function useReturnNewRunHistory(): (
	hasConfidenceInterval: boolean,
	refutationType: RefutationTypes,
) => RunHistory {
	const totalRefuters = useRefutationCount()
	const specCount = useSpecCount()
	const runHistory = useRunHistory()

	return useCallback(
		(hasConfidenceInterval: boolean, refutationType: RefutationTypes) => {
			return {
				id: v4(),
				runNumber: runHistory.length + 1,
				isActive: true,
				status: {
					status: NodeResponseStatus.Running,
					estimated_effect_completed: `0/${specCount}`,
					confidence_interval_completed: `0/${specCount}`,
					refute_completed: `0/${totalRefuters(specCount as number)}`,
					percentage: 0,
					time: {
						start: new Date(),
					},
				},
				hasConfidenceInterval,
				refutationType,
			} as RunHistory
		},
		[specCount, totalRefuters, runHistory],
	)
}
