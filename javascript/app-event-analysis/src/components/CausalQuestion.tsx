/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { FluentTheme } from '@thematic/fluent'
import React, { memo } from 'react'
import styled from 'styled-components'

import { useEventNameValueState } from '../state/EventName.js'
import { useHypothesisValueState } from '../state/Hypothesis.js'
import { useOutcomeNameValueState } from '../state/OutcomeName.js'
import { useUnitsValueState } from '../state/Units.js'

interface CausalQuestionProps {
	width?: string
}
export const CausalQuestion: React.FC<CausalQuestionProps> = memo(
	function CausalQuestion({ width = '100%' }) {
		const units = useUnitsValueState()
		const eventName = useEventNameValueState()
		const hypothesis = useHypothesisValueState()
		const outcomeName = useOutcomeNameValueState()

		return (
			<Title width={width}>
				For treated {units || '<units>'}, did {eventName || '<event>'} cause{' '}
				{outcomeName || '<outcome>'} to{' '}
				{hypothesis?.toLowerCase() || '<hypothesis>'}?
			</Title>
		)
	},
)

export const Title = styled.h3<{ width: string }>`
	position: absolute;
	top: 0;
	right: 0;
	width: ${({ width }) => `calc(${width} - 27rem)`};
	padding: 10px 0;
	margin: 0;
	font-weight: 500;
	text-align: center;
	color: ${({ theme }: { theme: FluentTheme }) =>
		theme.palette.neutralSecondary};
`
