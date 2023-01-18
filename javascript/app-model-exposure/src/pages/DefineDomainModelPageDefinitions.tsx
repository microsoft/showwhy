/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { DefinitionForm } from '../components/DefinitionForm.js'
import { Title } from '../components/styles.js'
import { useDefinitions } from '../state/definitions.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'

export const DefineDomainModelPageDefinitions: React.FC = memo(
	function DefineDomainModelPageDefinitions() {
		const definitions = useDefinitions()

		return (
			<>
				<Title style={{ fontSize: '18px' }} noMarginBottom>
					Alternative definitions
				</Title>
				<Title>Population</Title>
				<DefinitionForm
					definitionType={DefinitionType.Population}
					definitions={definitions}
				/>
				<Title>Exposure</Title>
				<DefinitionForm
					definitionType={DefinitionType.Exposure}
					definitions={definitions}
				/>
				<Title>Outcome</Title>
				<DefinitionForm
					definitionType={DefinitionType.Outcome}
					definitions={definitions}
				/>
			</>
		)
	},
)
