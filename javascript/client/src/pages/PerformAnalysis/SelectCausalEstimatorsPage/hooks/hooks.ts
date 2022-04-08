/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import {
	useEstimators,
	useRefutationCount,
	useSetRefutationCount,
} from '~state'

import { useEstimatorHook } from './estimators'

export function useBusinessLogic(): {
	estimator: ReturnType<typeof useEstimatorHook>
	refutationCount: number
	onRefutationCountChange: (_: any, count?: string) => void
} {
	const estimators = useEstimators()
	const refutationCount = useRefutationCount()
	const setRefutationCount = useSetRefutationCount()
	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	const onRefutationCountChange = useCallback(
		(_: any, count?: string) => {
			setRefutationCount(+(count || '1'))
		},
		[setRefutationCount],
	)

	useEffect(() => {
		estimators.length ? setDone() : setTodo()
	}, [estimators, setDone, setTodo])

	return {
		estimator: useEstimatorHook(),
		refutationCount,
		onRefutationCountChange,
	}
}
