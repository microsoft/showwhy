/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RadioButtonChoice } from '@showwhy/components'
import { CausalEffectsArrows, RadioButtonCard } from '@showwhy/components'
import { CausalModelLevel } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import { Container, Title } from '~styles'

import { useBusinessLogic } from './ConfirmDomainModelsPage.hooks'

export const ConfirmDomainModelsPage: React.FC = memo(
	function ConfirmDomainModelsPage() {
		const { causalEffects, onDefaultChange, primarySpecificationConfig } =
			useBusinessLogic()

		const causalModelOptions: RadioButtonChoice[] = [
			{
				key: CausalModelLevel.Maximum,
				title: CausalModelLevel.Maximum,
				isSelected:
					primarySpecificationConfig.causalModel === CausalModelLevel.Maximum,
				description:
					'Includes all edges with strong, moderate, or weak causal effects',
				onChange: onDefaultChange,
			},
			{
				key: CausalModelLevel.Intermediate,
				title: CausalModelLevel.Intermediate,
				isSelected:
					primarySpecificationConfig.causalModel ===
					CausalModelLevel.Intermediate,
				description:
					'Includes all edges with a strong or moderate  causal effects',
				onChange: onDefaultChange,
			},
			{
				key: CausalModelLevel.Minimum,
				title: CausalModelLevel.Minimum,
				isSelected:
					primarySpecificationConfig.causalModel === CausalModelLevel.Minimum,
				description: 'Includes all edges with strong causal effects only',
				onChange: onDefaultChange,
			},
			{
				key: CausalModelLevel.Unadjusted,
				title: CausalModelLevel.Unadjusted,
				isSelected:
					primarySpecificationConfig.causalModel ===
					CausalModelLevel.Unadjusted,
				description: 'Includes only the causal edge from exposure to outcome',
				onChange: onDefaultChange,
			},
		]

		return (
			<Container>
				<Title>Domain models</Title>
				<CausalEffectsArrows {...causalEffects} />
				<h4>Select the primary causal model</h4>
				<CardsContainer>
					{causalModelOptions.map(option => (
						<RadioButtonCard key={option.key} option={option} />
					))}
				</CardsContainer>
			</Container>
		)
	},
)

const CardsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr 1fr;
	gap: 1rem;
`
