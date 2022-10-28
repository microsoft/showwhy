/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { FluentTheme } from '@thematic/fluent'
import { memo } from 'react'
import styled from 'styled-components'

import type { CausalQuestion as Question } from '../types/question/CausalQuestion.js'

export const CausalQuestion: React.FC<{
	question: Question
}> = memo(function CausalQuestion({ question }) {
	const exposure = question.exposure?.label || '<exposure>'
	const population = question.population?.label || '<population>'
	const outcome = question.outcome?.label || '<outcome>'
	const hypothesis = question.hypothesis || '<hypothesis>'

	return (
		<Title data-pw="question">
			For {population}, does {exposure} cause {outcome} to {hypothesis}?
		</Title>
	)
})

export const Title = styled.h3`
	margin: 0;
	font-weight: 500;
	text-align: center;
	align-self: center;
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralSecondary};
`
