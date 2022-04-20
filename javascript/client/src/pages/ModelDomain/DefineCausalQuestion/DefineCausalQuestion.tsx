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

import { useBusinessLogic } from './DefineCausalQuestion.hooks'
import { FieldGroup } from './FieldGroup'

const hypothesisOptions: IChoiceGroupOption[] = [
	{ key: Hypothesis.Change, text: Hypothesis.Change },
	{ key: Hypothesis.Increase, text: Hypothesis.Increase },
	{ key: Hypothesis.Decrease, text: Hypothesis.Decrease },
].map(i => ({ ...i, 'data-pw': 'hypothesis-choice' }))

export const DefineCausalQuestion: React.FC = memo(
	function DefineCausalQuestion() {
		const { defineQuestion, onInputChange, setHypothesis } = useBusinessLogic()

		return (
			<Container>
				<FieldGroup
					type="population"
					question={defineQuestion.population}
					onChange={onInputChange}
				/>
				<FieldGroup
					type="exposure"
					question={defineQuestion.exposure}
					onChange={onInputChange}
				/>
				<FieldGroup
					type="outcome"
					question={defineQuestion.outcome}
					onChange={onInputChange}
				/>

				<Container>
					<FieldTitle>Hypothesis</FieldTitle>
					<ChoiceGroup
						onChange={setHypothesis}
						selectedKey={defineQuestion.hypothesis || Hypothesis.Change}
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
