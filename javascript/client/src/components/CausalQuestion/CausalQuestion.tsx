/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Experiment } from '@showwhy/types'
import { memo } from 'react'

import { Title } from '~styles'

export const CausalQuestion: React.FC<{
	defineQuestion: Experiment
}> = memo(function CausalQuestion({ defineQuestion }) {
	const exposure = defineQuestion.exposure?.label || '<exposure>'
	const population = defineQuestion.population?.label || '<population>'
	const outcome = defineQuestion.outcome?.label || '<outcome>'
	const hypothesis = defineQuestion.hypothesis || '<hypothesis>'

	return (
		<Title data-pw="question">
			For {population}, does {exposure} cause {outcome} to {hypothesis}?
		</Title>
	)
})
