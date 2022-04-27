/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isStatus } from '@showwhy/api-client'
import type { Maybe, SignificanceTest } from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useEffect, useMemo } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'

import { useCurrentSignificanceTest } from './useCurrentSignificanceTest'

export function useSignificanceTestData(selectedOutcome: string): {
	significanceTestResult: Maybe<SignificanceTest>
	significanceFailed: boolean
} {
	const significanceTestResult = useCurrentSignificanceTest(selectedOutcome)
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
	}
}
