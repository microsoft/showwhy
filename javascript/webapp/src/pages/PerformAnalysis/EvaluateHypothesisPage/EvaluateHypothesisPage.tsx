/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Dropdown } from '@fluentui/react'
import {
	CausalEffectsArrows,
	CausalEffectSize,
	CausalQuestion,
	Container,
	ContainerFlexColumn,
	Title,
} from '@showwhy/components'
import { NodeResponseStatus } from '@showwhy/types'
import { memo } from 'react'
import styled from 'styled-components'

import {
	useAlternativeModels,
	useCausalEffects,
	useDefaultRun,
	useLoadSpecificationData,
	useRefutationOptions,
	useSpecificationCurveData,
} from '~hooks'
import {
	useDefinitions,
	useEstimators,
	usePrimarySpecificationConfig,
	useQuestion,
} from '~state'

import { AnalysisSummary } from './AnalysisSummary'
import { EmptyDataPageWarning } from './EmptyDataPageWarning'
import { useSignificanceTestData } from './hooks/useSignificanceTestData'
import { useSignificanceTestManagement } from './hooks/useSignificanceTestManagement'
import { PageButtons } from './PageButtons'
import { ResultsGraph } from './ResultsGraph'
import { SignificanceTests } from './SignificanceTests'

export const EvaluateHypothesisPage: React.FC = memo(
	function EvaluateHypothesisPage() {
		const definitions = useDefinitions()
		const question = useQuestion()
		const refutationOptions = useRefutationOptions()
		const estimators = useEstimators()
		const defaultRun = useDefaultRun()
		const primarySpecificationConfig = usePrimarySpecificationConfig()
		const causalEffects = useCausalEffects(
			primarySpecificationConfig.causalModel,
		)
		const alternativeModels = useAlternativeModels(
			primarySpecificationConfig.causalModel,
		)
		const specificationData = useLoadSpecificationData()

		const {
			config,
			onMouseOver,
			hovered,
			failedRefutationIds,
			vegaWindowDimensions,
			outcomeOptions,
			selectedOutcome,
			setSelectedOutcome,
		} = useSpecificationCurveData()

		const { significanceTestResult, significanceFailed } =
			useSignificanceTestData()

		const { runSignificance, cancelRun, isCanceled, activeEstimatedEffects } =
			useSignificanceTestManagement(
				failedRefutationIds,
				specificationData,
				config,
			)

		if (
			!specificationData.length ||
			(defaultRun &&
				defaultRun?.status?.status !== NodeResponseStatus.Completed)
		) {
			return (
				<EmptyDataPageWarning
					text="To test the statistical significance of your estimates, wait for the server run on the previous page to complete"
					marginTop
				/>
			)
		}

		return (
			<ContainerFlexColumn data-pw="evaluate-hypothesis-content">
				<Container>
					<CausalQuestion question={question} />
					{outcomeOptions.length > 1 && (
						<DropdownContainer>
							<Dropdown
								label="Outcome"
								disabled={outcomeOptions.length <= 2}
								selectedKey={selectedOutcome}
								onChange={(_, val) => setSelectedOutcome(val?.key as string)}
								options={outcomeOptions}
							/>
						</DropdownContainer>
					)}
					<Container>
						<PageButtons
							significanceTestResult={significanceTestResult}
							significanceFailed={significanceFailed}
							runSignificance={runSignificance}
						/>

						<SignificanceTests
							activeEstimatedEffects={activeEstimatedEffects}
							question={question}
							cancelRun={cancelRun}
							isCanceled={isCanceled}
							significanceTestResult={significanceTestResult}
						/>
					</Container>
					<Container marginTop>
						<AnalysisSummary
							activeEstimatedEffects={activeEstimatedEffects}
							estimators={estimators}
							definitions={definitions}
							refutationOptions={refutationOptions}
							alternativeModels={alternativeModels}
						/>
					</Container>
				</Container>
				<Title>Domain model </Title>
				<Container>
					<Container>
						<CausalEffectsArrows
							size={CausalEffectSize.Small}
							{...causalEffects}
						/>
					</Container>
				</Container>
				<Title noMarginBottom noMarginTop>
					Effect size estimates
				</Title>
				<ResultsGraph
					specificationData={specificationData.filter(
						x => x.outcome === selectedOutcome,
					)}
					specificationCurveConfig={config}
					vegaWindowDimensions={vegaWindowDimensions}
					onMouseOver={onMouseOver}
					hovered={hovered}
					outcome={selectedOutcome}
					failedRefutationIds={failedRefutationIds}
				/>
			</ContainerFlexColumn>
		)
	},
)

const DropdownContainer = styled.div`
	width: 200px;
`
