/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo } from 'react'

import { Container } from './AnalyzeTestPage.styles.js'
import { AnalyzeTestPageEffects } from './AnalyzeTestPageEffects.js'
import { AnalyzeTestPageEstimators } from './AnalyzeTestPageEstimators.js'
import { AnalyzeTestPageHypothesis } from './AnalyzeTestPageHypothesis.js'

export const AnalyzeTestPage: React.FC = memo(function AnalyzeTestPage() {
	return (
		<Container>
			<AnalyzeTestPageEstimators />
			<AnalyzeTestPageEffects />
			<AnalyzeTestPageHypothesis />
		</Container>
	)
})
