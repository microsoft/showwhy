/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpinButton } from '@fluentui/react'
import { memo } from 'react'
import styled from 'styled-components'

import { Title } from '~styles'

import { EstimatorCard } from './EstimatorCard'
import { useBusinessLogic } from './SelectCausalEstimatorsPage.hooks'

export const SelectCausalEstimatorsPage: React.FC = memo(
	function SelectCausalEstimatorsPage() {
		const { estimatorOptions, refutationCount, onRefutationCountChange } =
			useBusinessLogic()

		return (
			<Container>
				<Section>
					<Title>Estimator definitions</Title>
					{estimatorOptions.map(card => (
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
					<Title noMarginBottom>Refutation Tests</Title>
					<CardsContainer>
						<SpinButton
							label="Number of simulations"
							defaultValue={refutationCount.toString()}
							min={1}
							step={1}
							data-pw="refuter-count"
							onChange={onRefutationCountChange}
							incrementButtonAriaLabel="Increase value by 1"
							decrementButtonAriaLabel="Decrease value by 1"
						/>
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

const CardsContainer = styled.div`
	width: 200px;
`
