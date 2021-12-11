/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Project, Step } from '~interfaces'
import { useSelectedProject } from '~state'

export function useFindStepsByPathname(pathNames: string[]): Step[] {
	const steps = useSelectedProject().steps
	return steps.flatMap(x => x.steps.filter(a => pathNames.includes(a.url)))
}

export function useCurrentStep(): Step | undefined {
	const project = useSelectedProject()
	const location = useLocation()
	return useCurrentStepTestable(project, location.pathname)
}

export function useCurrentStepTestable(project: Project, pathname: string) {
	return useMemo(() => {
		return project.steps
			.flatMap(x => x.steps.find(a => a.url === pathname))
			.find(x => x)
	}, [project, pathname])
}

export function useAllSteps(): Step[] {
	const steps = useSelectedProject().steps
	return steps.flatMap(x => x.steps)
}

export function useStepsShowStatus(): Step[] {
	const steps = useAllSteps()
	return steps.filter(s => s.showStatus)
}

/**
 * Callback to get a list of raw step ids from their urls
 * Exclude param toggles between getting the step ids directly
 * versus getting all other step ids.
 * @returns
 */
export function useGetStepUrls() {
	const allSteps = useStepsShowStatus().map(x => x.url)
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
