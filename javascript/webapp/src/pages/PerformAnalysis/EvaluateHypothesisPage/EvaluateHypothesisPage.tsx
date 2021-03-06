/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
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

import { AnalysisSummary } from './components/AnalysisSummary'
import { EmptyDataPageWarning } from './components/EmptyDataPageWarning'
import { NewTaskIdsMessage } from './components/NewTaskIdsMessage'
import { ResultsGraph } from './components/ResultsGraph'
import { RunManagement } from './components/RunManagement'
import { SignificanceTestResult } from './components/SignificanceTestResult'
import { useSignificanceTestData } from './hooks/useSignificanceTestData'
import { useSignificanceTestManagement } from './hooks/useSignificanceTestManagement'

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
			failedRefutationTaskIds,
			vegaWindowDimensions,
			outcomeOptions,
			selectedOutcome,
			setSelectedOutcome,
		} = useSpecificationCurveData()

		const {
			significanceTestResult,
			significanceFailed,
			hasAnyProcessingActive,
		} = useSignificanceTestData(selectedOutcome)

		const {
			runSignificance,
			cancelRun,
			isCanceled,
			activeEstimatedEffects,
			taskIdsChanged,
		} = useSignificanceTestManagement(
			failedRefutationTaskIds,
			specificationData,
			config,
			selectedOutcome,
			significanceTestResult,
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
					{taskIdsChanged && <NewTaskIdsMessage />}
					<Container>
						<RunManagement
							hasAnyProcessingActive={hasAnyProcessingActive}
							significanceTestResult={significanceTestResult}
							significanceFailed={significanceFailed}
							runSignificance={runSignificance}
							outcomeOptions={outcomeOptions}
							selectedOutcome={selectedOutcome}
							setSelectedOutcome={setSelectedOutcome}
							isCanceled={isCanceled}
							cancelRun={cancelRun}
						/>
						<SignificanceTestResult
							activeEstimatedEffects={activeEstimatedEffects}
							question={question}
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
					<CausalEffectsArrows
						size={CausalEffectSize.Small}
						{...causalEffects}
					/>
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
					failedRefutationTaskIds={failedRefutationTaskIds}
				/>
			</ContainerFlexColumn>
		)
	},
)
