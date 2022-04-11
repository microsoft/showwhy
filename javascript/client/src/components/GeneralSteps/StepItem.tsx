/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import { memo, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

import { useWorkflowStepStatus } from '~hooks'
import type { WorkflowStep } from '~types'

import { StepStatusDetail } from '.'

export const StepItem: React.FC<{
	stepDetail: WorkflowStep
	subStep?: Maybe<boolean>
}> = memo(function StepItem({ stepDetail, subStep = false }) {
	const { stepStatus, onToggleWorkflowStatus } =
		useWorkflowStepStatus(stepDetail)

	const getStepStatus = useCallback(
		(stepDetail: WorkflowStep) => {
			return stepDetail.showStatus ? (
				<StepStatusDetail
					toggleStatus={onToggleWorkflowStatus}
					status={stepStatus}
				/>
			) : null
		},
		[stepStatus, onToggleWorkflowStatus],
	)

	return (
		<CollapsibleContainer subStep={subStep}>
			<StepContainer>
				<StepLink
					activeClassName="active"
					key={stepDetail.url}
					to={stepDetail.url}
				>
					{stepDetail.title}
				</StepLink>
				{getStepStatus(stepDetail)}
			</StepContainer>
		</CollapsibleContainer>
	)
})

const CollapsibleContainer = styled.div<{ subStep: Maybe<boolean> }>`
	display: flex;
	flex-direction: column;
	padding-left: ${props => (props.subStep ? '8px' : '0px')};
`

const StepContainer = styled.div`
	display: flex;
	justify-content: space-between;
`

const StepLink = styled(NavLink)`
	text-decoration: unset;
	align-self: center;
	color: black;
	padding: 4px 0px 4px 8px;

	&.active {
		font-weight: bold;
	}

	&:hover {
		text-decoration: underline;
	}
`
