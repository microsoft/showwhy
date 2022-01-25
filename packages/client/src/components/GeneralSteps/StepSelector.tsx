/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex-js-toolkit/themed-components'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { StepItem } from './StepItem'
import { StepTitle } from '~components/StepTitle'
import { Workflow, StepList } from '~types'

interface StepSelectorProps {
	project: Workflow
}

export const StepSelector: React.FC<StepSelectorProps> = memo(
	function StepSelector({ project }) {
		const location = useLocation()
		const [openedPanels, setOpenedPanels] = useState<string[]>([])

		const panels: StepList[] = useMemo(() => {
			return project.steps.map(subStep => {
				if (subStep.steps.flatMap(a => a.subStepName).filter(x => x).length) {
					const unique = [
						...new Set(
							subStep.steps.flatMap(a => a.subStepName).filter(x => x),
						),
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

		const onHeaderClick = useCallback(
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

		const onParentOpen = useCallback(
			(parent: string) => {
				const newValues = [...openedPanels]
				newValues.push(parent)
				setOpenedPanels(newValues)
			},
			[openedPanels, setOpenedPanels],
		)

		useEffect(() => {
			let parent = ''
			let panelHeader =
				panels.find(a => a.steps.find(e => e.url === location.pathname))
					?.name || ''

			if (!panelHeader) {
				parent = project.steps.find(step => {
					const urls = step.steps.flatMap(a => a.url)
					return urls.includes(location.pathname)
				})?.name as string

				panelHeader = project.steps
					.map(step => {
						return step.steps.find(a => a.url === location.pathname)
							?.subStepName
					})
					.filter(x => x)
					.pop() as string
			}

			if (!openedPanels.includes(panelHeader)) {
				onHeaderClick(panelHeader, parent)
			} else if (parent.length && !openedPanels.includes(parent)) {
				onParentOpen(parent)
			}
		}, [location, panels, onHeaderClick, onParentOpen, openedPanels, project])

		const renderHeader = useCallback((title: string) => {
			return <CollapseHeader>{title}</CollapseHeader>
		}, [])

		const subPanelRenderHeader = useCallback((title: string) => {
			return <CollapseSubPanelHeader>{title}</CollapseSubPanelHeader>
		}, [])

		return (
			<Container>
				<StepTitle title="Workflow" />
				<CollapsiblePanelContainer>
					{panels.map((step: StepList) => (
						<CollapsiblePanel
							expandedState={openedPanels.includes(step.name)}
							onHeaderClick={() => onHeaderClick(step.name)}
							key={step.id}
							title={step.name}
							onRenderHeader={() => renderHeader(step.name)}
						>
							{step.subSteps?.length
								? step.subSteps?.map((subStep, index) => {
										return (
											<CollapsibleSubPanelContainer key={subStep.id}>
												<CollapsiblePanel
													first={index === 0}
													expandedState={openedPanels.includes(subStep.name)}
													onHeaderClick={() => onHeaderClick(subStep.name)}
													onRenderHeader={() =>
														subPanelRenderHeader(subStep.name)
													}
												>
													{subStep.steps.map(stepDetail => (
														<StepItem
															key={stepDetail.url}
															stepDetail={stepDetail}
														/>
													))}
												</CollapsiblePanel>
											</CollapsibleSubPanelContainer>
										)
								  })
								: null}
							{step.steps
								? step.steps.map(stepDetail => (
										<StepItem
											subStep={!!step.subSteps?.length}
											key={stepDetail.url}
											stepDetail={stepDetail}
										/>
								  ))
								: null}
						</CollapsiblePanel>
					))}
				</CollapsiblePanelContainer>
			</Container>
		)
	},
)

const Container = styled.div``

const CollapsibleSubPanelContainer = styled.div`
	padding-left: 16px;
`

const CollapseHeader = styled.span`
	font-size: 16px;
	font-weight: bold;
`
const CollapseSubPanelHeader = styled.span`
	font-size: 16px;
	font-weight: bold;
	padding-left: 16px;
`
