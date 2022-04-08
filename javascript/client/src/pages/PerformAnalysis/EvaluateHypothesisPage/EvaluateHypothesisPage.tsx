/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CausalEffectSize, NodeResponseStatus } from '@showwhy/types'
import { memo } from 'react'

import { CausalEffects } from '~components/CausalEffects'
import { CausalQuestion } from '~components/CausalQuestion'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { useSpecificationCurve } from '~hooks'
import { Container, ContainerFlexColumn, Title } from '~styles'
import { Pages } from '~types'

import { AnalysisSummary } from './AnalysisSummary'
import { useBusinessLogic } from './hooks'
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
		} = useBusinessLogic()

		const {
			config,
			onMouseOver,
			hovered,
			failedRefutationIds,
			vegaWindowDimensions,
			outcome,
		} = useSpecificationCurve()

		if (
			!specificationData.length ||
			(defaultRun &&
				defaultRun?.status?.status !== NodeResponseStatus.Completed)
		) {
			return (
				<EmptyDataPageWarning
					text="To see the summary of the estimates, run and wait a run estimate here: "
					linkText="Specification curve page"
					page={Pages.SpecificationCurvePage}
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
							defineQuestion={defineQuestion}
							refutationOptions={refutationOptions}
							alternativeModels={alternativeModels}
						/>
					</Container>
				</Container>
				<Title>Domain model </Title>
				<Container>
					<CausalEffects size={CausalEffectSize.Small} {...causalEffects} />
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
