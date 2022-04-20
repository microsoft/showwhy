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

import { useSpecificationCurveData } from '../EstimateCausalEffectsPage/EstimateCausalEffectPage.hooks'
import { AnalysisSummary } from './AnalysisSummary'
import { EmptyDataPageWarning } from './EmptyDataPageWarning'
import { useBusinessLogic } from './EvaluateHypothesisPage.hooks'
import { PageButtons } from './PageButtons'
import { ResultsGraph } from './ResultsGraph'
import { SignificanceTests } from './SignificanceTests'

export const EvaluateHypothesisPage: React.FC = memo(
	function EvaluateHypothesisPage() {
		const {
			alternativeModels,
			defaultRun,
			causalEffects,
			specificationData,
			defineQuestion,
			activeValues,
			significanceTestResult,
			significanceFailed,
			runSignificance,
			cancelRun,
			isCanceled,
			refutationOptions,
			estimators,
		} = useBusinessLogic()

		const {
			config,
			onMouseOver,
			hovered,
			failedRefutationIds,
			vegaWindowDimensions,
			outcome,
		} = useSpecificationCurveData()

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
							defaultRun={defaultRun}
							significanceTestResult={significanceTestResult}
							significanceFailed={significanceFailed}
							runSignificance={runSignificance}
						/>

						<SignificanceTests
							activeValues={activeValues}
							defineQuestion={defineQuestion}
							cancelRun={cancelRun}
							isCanceled={isCanceled}
							significanceTestResult={significanceTestResult}
						/>
					</Container>
					<Container marginTop>
						<AnalysisSummary
							activeValues={activeValues}
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
