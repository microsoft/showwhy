/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'

interface StepTitleProps {
	title: string
}

export const StepTitle: React.FC<StepTitleProps> = memo(function StepTitle({
	title,
}) {
	return (
		<Workflow>
			<WorkflowTitle>{title}</WorkflowTitle>
		</Workflow>
	)
})

const Workflow = styled.div`
	background-color: ${({ theme }) => theme.application().midContrast};
	padding: 8px 16px;
	height: 18px;
`

const WorkflowTitle = styled.span`
	color: white;
	font-weight: bold;
`
