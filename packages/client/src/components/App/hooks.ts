/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean, useId } from '@fluentui/react-hooks'
import { useCallback, useEffect, useMemo } from 'react'
import { useHistory } from 'react-router-dom'
import { StepStatus } from '~enums'
import {
	useCurrentStep,
	useGetStepUrls,
	useAllSteps,
	useExampleProjects,
	useLoadProject,
	useResetProject,
	useUploadZipMenuOption,
} from '~hooks'
import { FileDefinition } from '~interfaces'
import {
	useSelectedProject,
	useSetGuidance,
	useSetStepStatus,
	useStepStatus,
	useSetStepStatuses,
	useDefineQuestion,
} from '~state'
import { GenericObject } from '~types'

export const useLayout = (): GenericObject => {
	const project = useSelectedProject()
	const step = useCurrentStep()
	const setStepStatus = useSetStepStatus(step?.url)
	const stepStatus = useStepStatus(step?.url)
	const [isGuidanceVisible, { toggle: toggleGuidance }] = useBoolean(true)
	const setGuidance = useSetGuidance()
	const tooltipId = useId('tooltip')
	const handleGetStepUrls = useGetStepUrls()
	const handleSetAllStepStatus = useSetStepStatuses()
	const defineQuestion = useDefineQuestion()
	const examples = useExampleProjects()
	const loadExample = useLoadProject()
	const resetProject = useResetProject()
	const exampleProjects = useExampleProjects()
	const uploadZipMenuOption = useUploadZipMenuOption()

	const onClickProject = useCallback(
		(example: FileDefinition) => {
			resetProject()
			loadExample(example)
		},
		[loadExample, resetProject],
	)

	useEffect(() => {
		setGuidance(isGuidanceVisible)
	}, [isGuidanceVisible, setGuidance])

	const history = useHistory()
	const allSteps = useAllSteps()
	const currentStepIndex: number = useMemo((): any => {
		return allSteps.findIndex(s => s.url === step?.url) || 0
	}, [allSteps, step])

	const toggleStatus = useCallback(() => {
		setStepStatus(
			stepStatus === StepStatus.Done ? StepStatus.ToDo : StepStatus.Done,
		)
	}, [setStepStatus, stepStatus])

	const goToPage = useCallback(
		(url: string) => {
			history.push(url)
		},
		[history],
	)

	const previousUrl: string = useMemo(() => {
		const idx = currentStepIndex - 1
		if (idx >= 0) {
			return allSteps[idx].url
		}
		return ''
	}, [currentStepIndex, allSteps])

	const nextUrl: string = useMemo(() => {
		if (currentStepIndex < allSteps.length - 1) {
			return allSteps[currentStepIndex + 1].url
		}
		return ''
	}, [currentStepIndex, allSteps])

	return {
		handleGetStepUrls,
		handleSetAllStepStatus,
		defineQuestion,
		tooltipId,
		isGuidanceVisible,
		toggleGuidance,
		project,
		step,
		stepStatus,
		toggleStatus,
		previousUrl,
		nextUrl,
		goToPage,
		examples,
		onClickProject,
		exampleProjects,
		uploadZipMenuOption,
	}
}
