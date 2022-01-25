/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ChoiceGroup, IChoiceGroupOption } from '@fluentui/react'
import { memo } from 'react'

import styled from 'styled-components'
import { FieldGroup } from './FieldGroup'
import { useBusinessLogic } from './hooks'
import { Container } from '~styles'
import { Hypothesis } from '~types'

const hypothesisOptions: IChoiceGroupOption[] = [
	{ key: Hypothesis.Change, text: Hypothesis.Change },
	{ key: Hypothesis.Increase, text: Hypothesis.Increase },
	{ key: Hypothesis.Decrease, text: Hypothesis.Decrease },
]

export const DescribeElementsPage: React.FC = memo(
	function DescribeElementsPage() {
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
						selectedKey={defineQuestion.hypothesis}
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
