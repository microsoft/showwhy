/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IChoiceGroupOption } from '@fluentui/react'
import { ChoiceGroup } from '@fluentui/react'
import { Container } from '@showwhy/components'
import { Hypothesis } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { FieldGroup } from './FieldGroup'
import { useDefineCausalQuestion } from './hooks/useDefineCausalQuestion'

const hypothesisOptions: IChoiceGroupOption[] = [
	{ key: Hypothesis.Change, text: Hypothesis.Change },
	{ key: Hypothesis.Increase, text: Hypothesis.Increase },
	{ key: Hypothesis.Decrease, text: Hypothesis.Decrease },
].map(i => ({ ...i, 'data-pw': 'hypothesis-choice' }))

export const DefineCausalQuestion: React.FC = memo(
	function DefineCausalQuestion() {
		const { question, onInputChange, setHypothesis } = useDefineCausalQuestion()

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
					<ChoiceGroup
						onChange={setHypothesis}
						selectedKey={question.hypothesis || Hypothesis.Change}
						label="Exposure causes outcome to:"
						options={hypothesisOptions}
					/>
				</Container>
			</Container>
		)
	},
)

const FieldTitle = styled.h4`
	margin-bottom: unset;
`
