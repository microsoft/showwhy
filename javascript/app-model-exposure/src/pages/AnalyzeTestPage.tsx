/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useEffect } from 'react'

import { Container } from './AnalyzeTestPage.styles.js'
import { AnalyzeTestPageEffects } from './AnalyzeTestPageEffects.js'
import { AnalyzeTestPageEstimators } from './AnalyzeTestPageEstimators.js'
import { AnalyzeTestPageHelpText } from './AnalyzeTestPageHelpText.js'
import { AnalyzeTestPageHypothesis } from './AnalyzeTestPageHypothesis.js'
import type { ExposurePageProps } from './types.js'

export const AnalyzeTestPage: React.FC<ExposurePageProps> = memo(function AnalyzeTestPage({ api }) {
	useEffect(() => api.requestHelp('estimate'), [api])
	return (
		<Container>
			<AnalyzeTestPageEstimators />
			<AnalyzeTestPageEffects />
			<AnalyzeTestPageHypothesis />
			<AnalyzeTestPageHelpText />
		</Container>
	)
})
