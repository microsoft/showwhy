/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TextField } from '@fluentui/react'
import React, { memo } from 'react'
import styled from 'styled-components'

import {
	useEventNameState,
	useOutcomeNameState,
	useUnitsState,
} from '../../../state/index.js'
import { Container, StepTitle } from '../../../styles/index.js'
import { SectionContainer } from '../PrepareAnalysis.styles.js'

export const CausalQuestion: React.FC = memo(function CausalQuestion() {
	const [units, setUnits] = useUnitsState()
	const [eventName, setEventName] = useEventNameState()
	const [outcomeName, setOutcomeName] = useOutcomeNameState()
	return (
		<SectionContainer>
			<StepTitle>Format causal question</StepTitle>
			<QuestionContainer>
				<Container>
					<StepTitle>Units</StepTitle>
					<TextField
						placeholder="Units"
						value={units}
						onChange={(e, v) => setUnits(v || '')}
					/>
				</Container>
				<Container>
					<StepTitle>Treatment/Event</StepTitle>
					<TextField
						placeholder="Treatment/Event"
						value={eventName}
						onChange={(e, v) => setEventName(v || '')}
					/>
				</Container>
				<Container>
					<StepTitle>Outcome</StepTitle>
					<TextField
						placeholder="Outcome"
						value={outcomeName}
						onChange={(e, v) => setOutcomeName(v || '')}
					/>
				</Container>
			</QuestionContainer>
		</SectionContainer>
	)
})

const QuestionContainer = styled.div`
	display: grid;
	gap: 0.5rem;
	grid-template-columns: 1fr 1fr 1fr;
`
