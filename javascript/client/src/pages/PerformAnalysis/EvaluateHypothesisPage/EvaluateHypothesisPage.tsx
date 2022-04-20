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
	useEstimators,
	useExperiment,
	usePrimarySpecificationConfig,
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
		const defineQuestion = useExperiment()
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
			outcome,
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
					<CausalQuestion defineQuestion={defineQuestion} />
					<Container>
						<PageButtons
							significanceTestResult={significanceTestResult}
							significanceFailed={significanceFailed}
							runSignificance={runSignificance}
						/>

						<SignificanceTests
							activeEstimatedEffects={activeEstimatedEffects}
							defineQuestion={defineQuestion}
							cancelRun={cancelRun}
							isCanceled={isCanceled}
							significanceTestResult={significanceTestResult}
						/>
					</Container>
					<Container marginTop>
						<AnalysisSummary
							activeEstimatedEffects={activeEstimatedEffects}
							estimators={estimators}
							defineQuestion={defineQuestion}
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
					specificationData={specificationData}
					specificationCurveConfig={config}
					vegaWindowDimensions={vegaWindowDimensions}
					onMouseOver={onMouseOver}
					hovered={hovered}
					outcome={outcome}
					failedRefutationIds={failedRefutationIds}
				/>
			</ContainerFlexColumn>
		)
	},
)
