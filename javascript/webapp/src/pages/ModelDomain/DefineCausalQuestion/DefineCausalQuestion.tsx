/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Container } from '@showwhy/components'
import { memo } from 'react'
import styled from 'styled-components'

import { useDefineCausalQuestion } from './DefineCausalQuestion.hooks'
import { FieldGroup } from './FieldGroup'
import { HypothesisGroup } from './HypothesisGroup'

export const DefineCausalQuestion: React.FC = memo(
	function DefineCausalQuestion() {
		const { question, onInputChange } = useDefineCausalQuestion()

		return (
			<Container>
				<FieldGroup
					type="population"
					question={question.population}
					onChange={onInputChange}
				/>
				<FieldGroup
					type="exposure"
					question={question.exposure}
					onChange={onInputChange}
				/>
				<FieldGroup
					type="outcome"
					question={question.outcome}
					onChange={onInputChange}
				/>

				<Container>
					<FieldTitle>Hypothesis</FieldTitle>
					<HypothesisGroup hypothesis={question.hypothesis} />
				</Container>
			</Container>
		)
	},
)

const FieldTitle = styled.h4`
	margin-bottom: unset;
`
