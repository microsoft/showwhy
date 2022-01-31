/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Step } from '@data-wrangling-components/core'

import { selectStepDescription } from '@data-wrangling-components/react'
import React, { memo, useMemo } from 'react'
import styled from 'styled-components'

export interface StepComponentProps {
	step: Step
}

/**
 * Let's us render the Steps in a loop while memoing all the functions
 */
export const StepComponent: React.FC<StepComponentProps> = memo(
	function StepComponent({ step }) {
		const Description = useMemo(() => selectStepDescription(step), [step])

		return (
			<>
				{Description ? (
					<DescriptionContainer>
						<Description step={step} />
					</DescriptionContainer>
				) : null}
			</>
		)
	},
)

const DescriptionContainer = styled.div`
	margin: 8px 8px 8px 0px;
	border: 1px solid ${({ theme }) => theme.application().border().hex()};
	padding: 8px;
`
