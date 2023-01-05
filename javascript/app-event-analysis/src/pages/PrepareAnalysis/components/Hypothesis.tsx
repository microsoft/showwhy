/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Hypothesis as HypothesisTypes } from '@showwhy/app-common'
import { HypothesisGroup } from '@showwhy/app-common'
import React, { memo } from 'react'

import { useHypothesisState } from '../../../state/index.js'
import { StepTitle } from '../../../styles/index.js'
import {
	hypothesisGroupStyles,
	SectionContainer,
} from '../PrepareAnalysis.styles.js'

export const Hypothesis: React.FC = memo(function Hypothesis() {
	const [hypothesis, setHypothesis] = useHypothesisState()
	return (
		<SectionContainer>
			<StepTitle>Hypothesis</StepTitle>
			<HypothesisGroup
				onChange={(_, o) => setHypothesis(o?.key as HypothesisTypes)}
				hypothesis={hypothesis as HypothesisTypes}
				styles={hypothesisGroupStyles}
			/>
		</SectionContainer>
	)
})
