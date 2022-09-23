/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'

import { useAllVariables, useAutomaticWorkflowStatus } from '~hooks'

import { useCompletedElements } from './useCompletedElements'

export function useStepIsDone(): (hasVariable: boolean) => void {
	const completedElements = useCompletedElements()
	const allElements = useAllVariables()
	const { setDone, setTodo } = useAutomaticWorkflowStatus()

	return useCallback(
		(hasVariable: boolean) => {
			const done =
				allElements.length + 1 ===
				(hasVariable ? completedElements + 1 : completedElements - 1)
			done ? setDone() : setTodo()
		},
		[allElements, completedElements, setDone, setTodo],
	)
}
