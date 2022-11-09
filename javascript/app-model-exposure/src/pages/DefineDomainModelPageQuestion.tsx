/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { HypothesisGroup } from '@showwhy/app-common'
import { memo } from 'react'
import styled from 'styled-components'

import { FieldGroup } from '../components/FieldGroup.js'
import { Title } from '../components/styles.js'
import { useCausalQuestion } from '../state/causalQuestion.js'
import {
	useOnHypothesysChange,
	useOnInputChange,
} from './DefineDomainModelPage.hooks.js'
export const DefineDomainModelPageQuestion: React.FC = memo(
	function DefineDomainModelPageQuestion() {
		const question = useCausalQuestion()
		const onInputChange = useOnInputChange(question)
		const onHypothesisChange = useOnHypothesysChange(question)

		return (
			<>
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
					<Title noMarginBottom>Hypothesis</Title>
					<HypothesisGroup
						onChange={onHypothesisChange}
						hypothesis={question?.hypothesis}
					/>
				</Container>
			</>
		)
	},
)

const Container = styled.div``
