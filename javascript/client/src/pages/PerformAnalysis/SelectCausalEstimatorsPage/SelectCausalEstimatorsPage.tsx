/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'
import { Title } from '~styles'

import { EstimatorCard } from './EstimatorCard'
import { useBusinessLogic } from './hooks'
import { RefutationTests } from './RefutationTests'

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
					<RefutationTests options={refutationOptions} />
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

