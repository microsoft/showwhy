/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'
import styled from 'styled-components'
import { StepTitle } from '~components/StepTitle'
import { Step } from '~interfaces'

interface GuidanceProps {
	isVisible: boolean
	step?: Step
}

export const Guidance: React.FC<GuidanceProps> = memo(function Instructions({
	isVisible,
	step,
}) {
	return isVisible ? (
		<>
			<TitleContainer>
				<StepTitle title="Guidance" />
			</TitleContainer>
			<GuidanceText
				dangerouslySetInnerHTML={{ __html: step?.guidance || '' }}
			/>
		</>
	) : null
})

const GuidanceText = styled.div`
	padding: 0px 16px;
	overflow: auto;
	max-height: 95%;
`

const TitleContainer = styled.div`
	position: relative;
`
