/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Setter, StepList, Workflow } from '@showwhy/types'
import { useCallback, useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'

export function usePanels(project: Workflow): StepList[] {
	return useMemo(() => {
		return project.steps.map(subStep => {
			if (subStep.steps.flatMap(a => a.subStepName).filter(x => x).length) {
				const unique = [
					...new Set(subStep.steps.flatMap(a => a.subStepName).filter(x => x)),
				]
				const steps = unique.map((sub, id) => {
					return {
						id: id.toString(),
						name: sub || '',
						steps: subStep.steps.filter(a => a.subStepName === sub),
					}
				})
				const noSubStep = subStep.steps.filter(a => !a.subStepName)
				return {
					...subStep,
					steps: noSubStep,
					subSteps: steps,
				}
			}
			return subStep
		})
	}, [project])
}

type OnHeaderClickHandler = (val: string, parent?: string) => void
type OnOpenParentHandler = (parent: string) => void

export function useOnHeaderClick(
	openedPanels: string[],
	setOpenedPanels: Setter<string[]>,
): OnHeaderClickHandler {
	return useCallback(
		(val: string, parent = '') => {
			let newValues = [...openedPanels]
			if (newValues.includes(val)) {
				newValues = newValues.filter(x => x !== val)
			} else {
				newValues.push(val)
				if (parent.length) {
					newValues.push(parent)
				}
			}
			setOpenedPanels(newValues)
		},
		[openedPanels, setOpenedPanels],
	)
}

export function useOnOpenParent(
	openedPanels: string[],
	setOpenedPanels: Setter<string[]>,
): OnOpenParentHandler {
	return useCallback(
		(parent: string) => {
			const newValues = [...openedPanels]
			newValues.push(parent)
			setOpenedPanels(newValues)
		},
		[openedPanels, setOpenedPanels],
	)
}

export function useHeaderAndParentSynchronization(
	project: Workflow,
	panels: StepList[],
	openedPanels: string[],
	onHeaderClick: OnHeaderClickHandler,
	onOpenParent: OnOpenParentHandler,
): void {
	const location = useLocation()
	useEffect(() => {
		let parent = ''
		let panelHeader =
			panels.find(a => a.steps.find(e => e.url === location.pathname))?.name ||
			''

		if (!panelHeader) {
			parent = project.steps.find(step => {
				const urls = step.steps.flatMap(a => a.url)
				return urls.includes(location.pathname)
			})?.name as string

			panelHeader = project.steps
				.map(step => {
					return step.steps.find(a => a.url === location.pathname)?.subStepName
				})
				.filter(x => x)
				.pop() as string
		}

		if (!openedPanels.includes(panelHeader)) {
			onHeaderClick(panelHeader, parent)
		} else if (parent.length && !openedPanels.includes(parent)) {
			onOpenParent(parent)
		}
	}, [location, panels, onHeaderClick, onOpenParent, openedPanels, project])
}
