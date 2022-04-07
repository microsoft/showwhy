/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

import { RadioButtonCard } from '~components/CardComponent/RadioButtonCard'

import { EstimatorCard } from './EstimatorCard'
import { useBusinessLogic } from './hooks'

export const SelectCausalEstimatorsPage: React.FC = memo(
	function SelectCausalEstimatorsPage() {
		const { estimatorCardList, refutationOptions } = useBusinessLogic()

		return (
			<Container>
				<Section>
					<Title>Estimator definitions</Title>
					{estimatorCardList?.map(card => (
						<EstimatorCard
							key={card.key}
							title={card.title}
							description={card.description}
							list={card.list}
							isCardChecked={card.isCardChecked}
							onCardClick={card.onCardClick}
						/>
					))}
				</Section>
				<Section>
					<Title>Refutation Tests</Title>
					<CardsContainer>
						{refutationOptions.map(option => (
							<RadioButtonCard key={option.key} option={option} />
						))}
					</CardsContainer>
				</Section>
			</Container>
		)
	},
)

const Container = styled.article`
	display: flex;
	flex-direction: column;
	max-width: 100%;
`

const Section = styled.section``

const Title = styled.h2`
	font-weight: 500;
	font-size: 1.3rem;
	margin: 0.5rem;
`

const CardsContainer = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1rem;
`
