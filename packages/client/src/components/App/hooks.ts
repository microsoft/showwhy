/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { StepStatus } from '~enums'
import {
	useCurrentStep,
	useAllSteps,
	useLoadProject,
	useResetProject,
} from '~hooks'
import { FileDefinition, Step } from '~interfaces'
import { useSetGuidance, useSetStepStatus, useStepStatus } from '~state'

export function useGuidance(): [boolean, () => void] {
	/* TODO: this is synchronizing state between an in-memory hook and recoil. This should just use recoil*/
	const [isGuidanceVisible, { toggle: toggleGuidance }] = useBoolean(true)
	const setGuidance = useSetGuidance()
	useEffect(() => {
		setGuidance(isGuidanceVisible)
	}, [isGuidanceVisible, setGuidance])
	return [isGuidanceVisible, toggleGuidance]
}

export function useOnClickProject() {
	const loadExample = useLoadProject()
	const resetProject = useResetProject()

	return useCallback(
		(example: FileDefinition) => {
			resetProject()
			loadExample(example)
		},
		[loadExample, resetProject],
	)
}

export function useGoToPageHandler(): (url: string) => void {
	const history = useHistory()
	return useCallback(
		(url: string) => {
			history.push(url)
		},
		[history],
	)
}

export function useProcessStepInfo(): {
	step: Step | undefined
	stepStatus: StepStatus | undefined
	toggleStepStatus: () => void
	previousStepUrl: string
	nextStepUrl: string
} {
	const step = useCurrentStep()
	const setStepStatus = useSetStepStatus(step?.url)
	const stepStatus = useStepStatus(step?.url)

	const allSteps = useAllSteps()
	const currentStepIndex: number = useMemo((): any => {
		return allSteps.findIndex(s => s.url === step?.url) || 0
	}, [allSteps, step])

	const toggleStepStatus = useCallback(() => {
		setStepStatus(
			stepStatus === StepStatus.Done ? StepStatus.ToDo : StepStatus.Done,
		)
	}, [setStepStatus, stepStatus])

	const previousStepUrl: string = useMemo(() => {
		const idx = currentStepIndex - 1
		if (idx >= 0) {
			return allSteps[idx].url
		}
		return ''
	}, [currentStepIndex, allSteps])

	const nextStepUrl: string = useMemo(() => {
		if (currentStepIndex < allSteps.length - 1) {
			return allSteps[currentStepIndex + 1].url
		}
		return ''
	}, [currentStepIndex, allSteps])

	return {
		step,
		stepStatus,
		toggleStepStatus,
		previousStepUrl,
		nextStepUrl,
	}
}
