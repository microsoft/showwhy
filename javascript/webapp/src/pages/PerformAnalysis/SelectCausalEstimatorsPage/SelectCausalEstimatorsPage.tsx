/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { SpinButton } from '@fluentui/react'
import { Title } from '@showwhy/components'
import { memo, useCallback, useEffect } from 'react'
import styled from 'styled-components'

import { useAutomaticWorkflowStatus } from '~hooks'
import {
	useConfounderThreshold,
	useCovariateProportionThreshold,
	useEstimators,
	useRefutationCount,
	useSetRefutationCount,
} from '~state'

import { EstimatorCard } from './EstimatorCard'
import { useEstimatorOptions } from './hooks/useEstimatorOptions'
import {
	useOnConfounderThresholdChange,
	useOnProportionThresholdChange,
	useOnThresholdDecrement,
	useOnThresholdIncrement,
} from './hooks/useOnConfounderThresholdChange'
import {
	COVARIATE_BALANCE_SUFFIX,
	ESTIMATORS_HAVE_COVARIATE,
} from './SelectCausalEstimatorsPage.constants'

export const SelectCausalEstimatorsPage: React.FC = memo(
	function SelectCausalEstimatorsPage() {
		const estimators = useEstimators()
		const estimatorOptions = useEstimatorOptions(estimators)
		const confounderThreshold = useConfounderThreshold()
		const proportionThreshold = useCovariateProportionThreshold()
		const refutationCount = useRefutationCount()
		const setRefutationCount = useSetRefutationCount()
		const onConfounderThresholdChange =
			useOnConfounderThresholdChange(confounderThreshold)
		const onProportionThresholdChange =
			useOnProportionThresholdChange(confounderThreshold)
		const onThresholdDecrement = useOnThresholdDecrement()
		const onThresholdIncrement = useOnThresholdIncrement()
		const { setDone, setTodo } = useAutomaticWorkflowStatus()

		const onRefutationCountChange = useCallback(
			(_: any, count = '1') => {
				setRefutationCount(+count)
			},
			[setRefutationCount],
		)

		useEffect(() => {
			estimators.length ? setDone() : setTodo()
		}, [estimators, setDone, setTodo])

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
				<Section>
					<Title noMarginBottom>Allow Covariate Imbalance Threshold</Title>
					<CardsContainer>
						<SpinButton
							label="Maximum per confounder"
							value={confounderThreshold.toString() + COVARIATE_BALANCE_SUFFIX}
							min={1}
							max={100}
							step={5}
							disabled={
								!estimators.find(x =>
									ESTIMATORS_HAVE_COVARIATE.includes(x.type),
								)
							}
							data-pw="confounder-treshold"
							onChange={onConfounderThresholdChange}
							onIncrement={(val: string) =>
								onThresholdIncrement(confounderThreshold, val)
							}
							onDecrement={(val: string) =>
								onThresholdDecrement(confounderThreshold, val)
							}
							incrementButtonAriaLabel="Increase value by 5"
							decrementButtonAriaLabel="Decrease value by 5"
						/>
					</CardsContainer>
					<CardsContainer>
						<SpinButton
							label="Maximum proportion"
							value={proportionThreshold.toString() + COVARIATE_BALANCE_SUFFIX}
							min={1}
							max={100}
							step={5}
							disabled={
								!estimators.find(x =>
									ESTIMATORS_HAVE_COVARIATE.includes(x.type),
								)
							}
							data-pw="proportion-all-treshold"
							onChange={onProportionThresholdChange}
							onIncrement={(val: string) =>
								onThresholdIncrement(proportionThreshold, val)
							}
							onDecrement={(val: string) =>
								onThresholdDecrement(proportionThreshold, val)
							}
							incrementButtonAriaLabel="Increase value by 5"
							decrementButtonAriaLabel="Decrease value by 5"
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
