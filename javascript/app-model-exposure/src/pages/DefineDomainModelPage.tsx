/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHelpOnMount } from '@datashaper/app-framework'
import { memo } from 'react'

import { Container } from './DefineDomainModelPage.styles.js'
import { DefineDomainModelPageDefinitions } from './DefineDomainModelPageDefinitions.js'
import { DefineDomainModelPageQuestion } from './DefineDomainModelPageQuestion.js'
import type { ExposurePageProps } from './types.js'

export const DefineDomainModelPage: React.FC<ExposurePageProps> = memo(
	function DefineDomainModelPage() {
		useHelpOnMount('define')
		return (
			<Container>
				<DefineDomainModelPageQuestion />
				<DefineDomainModelPageDefinitions />
			</Container>
		)
	},
)
