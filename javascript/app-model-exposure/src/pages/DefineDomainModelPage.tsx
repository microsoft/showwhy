/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { Container } from './DefineDomainModelPage.styles.js'
import { DefineDomainModelPageDefinitions } from './DefineDomainModelPageDefinitions.js'
import { DefineDomainModelPageQuestion } from './DefineDomainModelPageQuestion.js'

export const DefineDomainModelPage: React.FC = memo(
	function DefineDomainModelPage() {
		return (
			<Container>
				<DefineDomainModelPageQuestion />
				<DefineDomainModelPageDefinitions />
			</Container>
		)
	},
)
