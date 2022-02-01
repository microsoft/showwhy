/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'
import { useCurrentStep, useAllSteps } from '~hooks'
import { useSetStepStatus, useStepStatus } from '~state'
import { Handler0, Step, StepStatus } from '~types'

export type ToggleStepStatusHandler = Handler0
export interface ProcessStepInfo {
	step: Step | undefined
	stepStatus: StepStatus | undefined
	previousStepUrl: string
	nextStepUrl: string
	onToggleStepStatus: ToggleStepStatusHandler
}

export function useProcessStepInfo(): ProcessStepInfo {
	const step = useCurrentStep()
	const allSteps = useAllSteps()
	const stepStatus = useStepStatus(step?.url)
	const currentStepIndex = useCurrentStepIndex(allSteps, step)
	const previousStepUrl = usePreviousStepUrl(allSteps, currentStepIndex)
	const nextStepUrl = useNextStepUrl(allSteps, currentStepIndex)
	const onToggleStepStatus = useToggleStepStatus(step, stepStatus)

	return {
		step,
		stepStatus,
		previousStepUrl,
		nextStepUrl,
		onToggleStepStatus,
	}
}

function useCurrentStepIndex(
	allSteps: Step[],
	currentStep: Step | undefined,
): number {
	return useMemo(() => {
		return allSteps.findIndex(s => s.url === currentStep?.url) || 0
	}, [allSteps, currentStep])
}

function useToggleStepStatus(
	step: Step | undefined,
	stepStatus: StepStatus | undefined,
): () => void {
	const setStepStatus = useSetStepStatus(step?.url)
	return useCallback(() => {
		setStepStatus(
			stepStatus === StepStatus.Done ? StepStatus.ToDo : StepStatus.Done,
		)
	}, [setStepStatus, stepStatus])
}

function usePreviousStepUrl(
	allSteps: Step[],
	currentStepIndex: number,
): string {
	return useMemo(() => {
		const idx = currentStepIndex - 1
		if (idx >= 0) {
			return allSteps[idx].url
		}
		return ''
	}, [currentStepIndex, allSteps])
}

function useNextStepUrl(allSteps: Step[], currentStepIndex: number): string {
	return useMemo(() => {
		if (currentStepIndex < allSteps.length - 1) {
			return allSteps[currentStepIndex + 1].url
		}
		return ''
	}, [currentStepIndex, allSteps])
}
