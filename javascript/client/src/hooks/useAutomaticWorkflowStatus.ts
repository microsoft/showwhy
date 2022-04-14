/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { StepStatus } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetStepStatus } from '~state'

import { useCurrentStep } from './steps'

export function useAutomaticWorkflowStatus(): {
	setDone: Handler
	setTodo: Handler
} {
	const currentStep = useCurrentStep()
	const setStepStatus = useSetStepStatus(currentStep?.url)

	const setDone = useCallback(() => {
		setStepStatus(StepStatus.Done)
	}, [setStepStatus])

	const setTodo = useCallback(() => {
		setStepStatus(StepStatus.ToDo)
	}, [setStepStatus])

	return {
		setDone,
		setTodo,
	}
}
