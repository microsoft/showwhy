/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isProcessingStatus, isStatus } from '@showwhy/api-client'
import type { Maybe, RunHistory, SignificanceTest } from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useEffect, useMemo } from 'react'

import { useAutomaticWorkflowStatus, useDefaultRun } from '~hooks'
import { useSignificanceTest } from '~state'

export function useSignificanceTestData(selectedOutcome: string): {
	significanceTestResult: Maybe<SignificanceTest>
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

	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	useEffect(() => {
		!isStatus(significanceTestResult?.status, NodeResponseStatus.Completed)
			? setTodo()
			: setDone()
	}, [significanceTestResult, setDone, setTodo])

	const significanceFailed = useMemo((): boolean => {
		return (
			significanceTestResult?.status?.toLowerCase() ===
			NodeResponseStatus.Failed
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
	significanceTest: SignificanceTest[],
	defaultRun?: RunHistory,
): Maybe<SignificanceTest> {
	if (!defaultRun) return undefined
	return significanceTest.find(
		x => x.runId === defaultRun.id && x.outcome === selectedOutcome,
	)
}

function isProcessingAny(significanceTest: SignificanceTest[]): boolean {
	return !!significanceTest.find(x =>
		isProcessingStatus(x.status as NodeResponseStatus),
	)
}
