/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { Title } from '~styles'
import { Experiment } from '~types'

interface CausalQuestionProps {
	defineQuestion: Experiment
}

export const CausalQuestion: React.FC<CausalQuestionProps> = memo(
	function CausalQuestion({ defineQuestion }) {
		const exposure = defineQuestion.exposure?.label || '<exposure>'
		const population = defineQuestion.population?.label || '<population>'
		const outcome = defineQuestion.outcome?.label || '<outcome>'
		const hypothesis = defineQuestion.hypothesis || '<hypothesis>'

		return (
			<Title>
				For {population}, does {exposure} cause {outcome} to {hypothesis}?
			</Title>
		)
	},
)
