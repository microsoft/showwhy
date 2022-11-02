/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Link } from '@fluentui/react'
import React, { memo } from 'react'

import { P, PageSection } from './AnalyzeTestPage.styles.js'

export const AnalyzeTestPageHelpText: React.FC = memo(
	function AnalyzeTestPageHelpText() {
		return (
			<PageSection>
				<P>
					Analysis approach based on Simonsohn, U., Simmons, J.P. & Nelson, L.D.{' '}
					<Link
						href="https://doi.org/10.1038/s41562-020-0912-z"
						target="_blank"
					>
						Specification curve analysis. Nature Human Behaviour 4, 1208–1214
						(2020)
					</Link>
					.
				</P>
			</PageSection>
		)
	},
)
