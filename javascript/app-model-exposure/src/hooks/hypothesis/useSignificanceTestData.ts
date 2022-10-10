/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { isProcessingStatus } from '../../api-client/utils.js'
import { useSignificanceTest } from '../../state/significanceTests.js'
import { NodeResponseStatus } from '../../types/api/NodeResponseStatus.js'
import type { SignificanceTestStatus } from '../../types/api/SignificanceTestStatus.js'
import type { Maybe } from '../../types/primitives.js'
import type { RunHistory } from '../../types/runs/RunHistory.js'
import { useDefaultRun } from '../runHistory.js'

export function useSignificanceTestData(selectedOutcome: string): {
	significanceTestResult: Maybe<SignificanceTestStatus>
	significanceFailed: boolean
	hasAnyProcessingActive: boolean
} {
	const defaultRun = useDefaultRun()
	const significanceTest = useSignificanceTest()
	const significanceTestResult = currentSignificanceTest(
		selectedOutcome,
		significanceTest,
		defaultRun,
	)
	const hasAnyProcessingActive = isProcessingAny(significanceTest)

	const significanceFailed = useMemo((): boolean => {
		return (
			significanceTestResult?.status?.toLowerCase() ===
			NodeResponseStatus.Failure
		)
	}, [significanceTestResult])

	return {
		significanceTestResult,
		significanceFailed,
		hasAnyProcessingActive,
	}
}

function currentSignificanceTest(
	selectedOutcome: string,
	significanceTest: SignificanceTestStatus[],
	defaultRun?: RunHistory,
): Maybe<SignificanceTestStatus> {
	if (!defaultRun) return undefined
	return significanceTest.find(
		x => x.taskId === defaultRun.id && x.outcome === selectedOutcome,
	)
}

function isProcessingAny(significanceTest: SignificanceTestStatus[]): boolean {
	return !!significanceTest.find(x =>
		isProcessingStatus(x.status as NodeResponseStatus),
	)
}
