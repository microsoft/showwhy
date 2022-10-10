/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { memo } from 'react'

import { DefinitionForm } from '../components/DefinitionForm.js'
import { Title } from '../components/styles.js'
import { useCausalQuestion } from '../state/causalQuestion.js'
import { useDefinitions } from '../state/definitions.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'

export const DefineDomainModelPageDefinitions: React.FC = memo(
	function DefineDomainModelPageDefinitions() {
		const question = useCausalQuestion()
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
					questionElement={question.population}
				/>
				<Title>Exposure</Title>
				<DefinitionForm
					definitionType={DefinitionType.Exposure}
					definitions={definitions}
					questionElement={question.exposure}
				/>
				<Title>Outcome</Title>
				<DefinitionForm
					definitionType={DefinitionType.Outcome}
					definitions={definitions}
					questionElement={question.outcome}
				/>
			</>
		)
	},
)
