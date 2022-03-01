/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CollapsiblePanel,
	CollapsiblePanelContainer,
} from '@essex-js-toolkit/themed-components'
import { memo, useCallback, useState } from 'react'
import styled from 'styled-components'
import { StepItem } from '../StepItem'
import {
	useHeaderAndParentSynchronization,
	useOnHeaderClick,
	useOnOpenParent,
	usePanels,
} from './StepSelector.hooks'
import { StepTitle } from '~components/StepTitle'
import type { Workflow, StepList } from '~types'

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
})

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
