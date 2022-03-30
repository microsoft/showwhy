/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler, Maybe } from '@showwhy/types'
import { useMemo } from 'react'

import { useAllSteps, useCurrentStep } from '~hooks'
import { useStepStatus } from '~state'
import type { StepStatus, WorkflowStep } from '~types'

export type ToggleStepStatusHandler = Handler
export interface ProcessStepInfo {
	step: Maybe<WorkflowStep>
	stepStatus: Maybe<StepStatus>
	previousStepUrl: string
	nextStepUrl: string
}

export function useProcessStepInfo(): ProcessStepInfo {
	const step = useCurrentStep()
	const allSteps = useAllSteps()
	const stepStatus = useStepStatus(step?.url)
	const currentStepIndex = useCurrentStepIndex(allSteps, step)
	const previousStepUrl = usePreviousStepUrl(allSteps, currentStepIndex)
	const nextStepUrl = useNextStepUrl(allSteps, currentStepIndex)

	return {
		step,
		stepStatus,
		previousStepUrl,
		nextStepUrl,
	}
}

function useCurrentStepIndex(
	allSteps: WorkflowStep[],
	currentStep: Maybe<WorkflowStep>,
): number {
	return useMemo(() => {
		return allSteps.findIndex(s => s.url === currentStep?.url) || 0
	}, [allSteps, currentStep])
}

function usePreviousStepUrl(
	allSteps: WorkflowStep[],
	currentStepIndex: number,
): string {
	return useMemo(() => {
		const idx = currentStepIndex - 1
		if (idx >= 0) {
			return allSteps[idx]!.url
		}
		return ''
	}, [currentStepIndex, allSteps])
}

function useNextStepUrl(
	allSteps: WorkflowStep[],
	currentStepIndex: number,
): string {
	return useMemo(() => {
		if (currentStepIndex < allSteps.length - 1) {
			return allSteps[currentStepIndex + 1]!.url
		}
		return ''
	}, [currentStepIndex, allSteps])
}
