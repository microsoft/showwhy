/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { StepStatusDetail } from '.'
import { Step } from '~interfaces'
import { useStepStatus } from '~state'

interface StepItemProps {
	stepDetail: Step
	subStep?: boolean | undefined
}
export const StepItem: React.FC<StepItemProps> = memo(function StepItem({
	stepDetail,
	subStep = false,
}) {
	const stepStatus = useStepStatus(stepDetail.url)

	const getStepStatus = useCallback(
		(stepDetail: Step) => {
			return stepDetail.showStatus ? (
				<StepStatusDetail status={stepStatus} />
			) : null
		},
		[stepStatus],
	)

	return (
		<CollapsibleContainer subStep={subStep}>
			<StepLink
				activeClassName="active"
				key={stepDetail.url}
				to={stepDetail.url}
			>
				<StepDetailsContainer>
					<StepName>{stepDetail.title}</StepName>
					{getStepStatus(stepDetail)}
				</StepDetailsContainer>
			</StepLink>
		</CollapsibleContainer>
	)
})

const CollapsibleContainer = styled.div<{ subStep: boolean }>`
	display: flex;
	flex-direction: column;
	padding-left: ${props => (props.subStep ? '8px' : '0px')};
`

const StepLink = styled(NavLink)`
	text-decoration: unset;
	color: black;
	&.active {
		font-weight: bold;
	}

	&:hover {
		text-decoration: underline;
	}
`

const StepDetailsContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const StepName = styled.span`
	padding: 4px 8px;
`
