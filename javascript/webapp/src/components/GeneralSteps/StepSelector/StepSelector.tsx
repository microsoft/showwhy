/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex/themed-components'
import { StepTitle } from '@showwhy/components'
import type { StepList, Workflow } from '@showwhy/types'
import { memo, useState } from 'react'
import styled from 'styled-components'

import { StepItem } from '../StepItem'
import {
	useHeaderAndParentSynchronization,
	useOnHeaderClick,
	useOnOpenParent,
	usePanels,
} from './hooks'

export const StepSelector: React.FC<{
	project: Workflow
}> = memo(function StepSelector({ project }) {
	const [openedPanels, setOpenedPanels] = useState<string[]>([])
	const panels = usePanels(project)
	const onHeaderClick = useOnHeaderClick(openedPanels, setOpenedPanels)
	const onParentOpen = useOnOpenParent(openedPanels, setOpenedPanels)

	useHeaderAndParentSynchronization(
		project,
		panels,
		openedPanels,
		onHeaderClick,
		onParentOpen,
	)

	return (
		<Container>
			<StepTitle title="Workflow" />
			<PanelWrapper>
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
			</PanelWrapper>
		</Container>
	)
})

function renderHeader(title: string): JSX.Element {
	return <CollapseHeader>{title}</CollapseHeader>
}

function subPanelRenderHeader(title: string): JSX.Element {
	return <CollapseSubPanelHeader>{title}</CollapseSubPanelHeader>
}

const Container = styled.div`
	height: 100%;
`

const PanelWrapper = styled.div`
	height: 95%;
	overflow: hidden auto;
`

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
