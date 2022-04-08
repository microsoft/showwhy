/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useEffect } from 'react'

import { useAutomaticWorkflowStatus } from '~hooks'
import { useEstimators } from '~state'

import { useEstimatorHook } from './estimators'
import { useRefutations } from './refutations'

export function useBusinessLogic(): ReturnType<typeof useEstimatorHook> &
	ReturnType<typeof useRefutations> {
	const estimators = useEstimators()
	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	useEffect(() => {
		estimators.length ? setDone() : setTodo()
	}, [estimators, setDone, setTodo])

	return {
		...useEstimatorHook(),
		...useRefutations(),
	}
}
