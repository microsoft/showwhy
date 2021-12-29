/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { NodeResponseStatus } from '~enums'
import { RunHistory } from '~interfaces'
import {
	useResetSpecificationCurveConfig,
	useRunHistory,
	useSetRunHistory,
} from '~state'
import { disableAllRuns, isStatusProcessing } from '~utils'

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
		[runHistory, setRunHistory, resetSpecificationConfig],
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
