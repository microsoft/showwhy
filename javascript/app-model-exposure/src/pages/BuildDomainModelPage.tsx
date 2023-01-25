/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useHelpOnMount } from '@datashaper/app-framework'
import { RadioButtonCard } from '@showwhy/app-common'
import { memo } from 'react'

import { CausalEffectsArrows } from '../components/CausalEffectsArrows.js'
import { DetailsList } from '../components/DetailsList.js'
import { RelevantVariablesForm } from '../components/RelevantVariablesForm.js'
import { Title } from '../components/styles.js'
import { useCausalEffects } from '../hooks/causalEffects.js'
import { useDetailsList } from '../hooks/useCausalFactorsDetailsList.js'
import { useDimensions } from '../hooks/useDimensions.js'
import { usePrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import {
	useFactorsTable,
	useOnCausalModelChange,
} from './BuildDomainModelPage.hooks.js'
import {
	CardsContainer,
	Container,
	ListContainer,
	PageSection,
} from './BuildDomainModelPage.styles.js'
import {
	buildCausalModelOptions,
	buildFormHeaders,
	buildHeaders,
} from './BuildDomainModelPage.utils.js'
import type { ExposurePageProps } from './types.js'

export const BuildDomainModelPage: React.FC<ExposurePageProps> = memo(
	function BuildDomainModelPage() {
		useHelpOnMount('exposure.model')
		const primarySpecificationConfig = usePrimarySpecificationConfig()
		const causalEffects = useCausalEffects(
			primarySpecificationConfig.causalModel,
		)

		const onChange = useOnCausalModelChange()
		const options = buildCausalModelOptions(
			primarySpecificationConfig.causalModel,
			onChange,
		)

		const { items, addFactor } = useDetailsList() // eslint-disable-line
		const { itemList } = useFactorsTable()
		const { ref, width } = useDimensions()
		const headers = buildHeaders(width)
		const formHeaders = buildFormHeaders(width)

		return (
			<Container>
				<PageSection>
					<Title>Domain models</Title>
					<CausalEffectsArrows width={width} {...causalEffects} />
				</PageSection>

				<Title>Select the primary causal model</Title>
				<CardsContainer>
					{options.map(option => (
						<RadioButtonCard key={option.key} option={option} />
					))}
				</CardsContainer>
				<ListContainer ref={ref}>
					<Title data-pw="title">Relevant variables</Title>
					{/* eslint-disable-next-line */}
					<DetailsList items={items} headers={formHeaders} />
				</ListContainer>
				<RelevantVariablesForm onAdd={addFactor} />
				<Title data-pw="title">Variable relationships</Title>
				<ListContainer ref={ref}>
					<DetailsList headers={headers} items={itemList} />
				</ListContainer>
			</Container>
		)
	},
)
