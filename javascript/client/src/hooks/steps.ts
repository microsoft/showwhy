/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe, Workflow, WorkflowStep } from '@showwhy/types'
import { StepStatus } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelectedProject } from '~state/project'
import { useStepStatus } from '~state/stepStatus'

export function useCurrentStep(): Maybe<WorkflowStep> {
	const project = useSelectedProject()
	const location = useLocation()
	return useCurrentStepTestable(project, location.pathname)
}

export function useCurrentStepTestable(
	project: Workflow,
	pathname: string,
): Maybe<WorkflowStep> {
	return useMemo(() => {
		return project.steps
			.flatMap(x => x.steps.find(a => a.url === pathname))
			.find(x => x)
	}, [project, pathname])
}

export function useAllSteps(): WorkflowStep[] {
	const steps = useSelectedProject().steps
	return steps.flatMap(x => x.steps)
}

/**
 * Callback to get a list of raw step ids from their urls
 * Exclude param toggles between getting the step ids directly
 * versus getting all other step ids.
 * @returns
 */
export function useGetStepUrls(): (urls?: string[], exclude?: any) => string[] {
	const allSteps = useAllSteps().map(x => x.url)
	return useCallback(
		(urls: string[] = [], exclude = false) => {
			if (exclude) {
				return allSteps.filter(step => !urls.includes(step))
			}
			return allSteps
		},
		[allSteps],
	)
}

export function useGetStepUrlsByStatus(): (options?: {
	status?: StepStatus
	exclude?: boolean
}) => string[] {
	const stepStatus = useStepStatus
	const allSteps = useAllSteps().map(step => {
		return {
			url: step.url,
			status: stepStatus(step.url),
		}
	})
	return useCallback(
		(options?: { status?: StepStatus; exclude?: boolean }) => {
			const { status = StepStatus.Done, exclude = false } = options || {}
			if (exclude) {
				return allSteps.filter(x => x.status !== status).map(x => x.url)
			}
			return allSteps.filter(x => x.status === status).map(x => x.url)
		},
		[allSteps],
	)
}
