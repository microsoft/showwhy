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
import { Container, ContainerFlexColumn } from '~styles'
import { Pages } from '~types'

import { AnalysisSpecifications } from './AnalysisSpecifications'
import { CausalDetails } from './CausalDetails'
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
			refutationLength,
			defineQuestion,
			activeValues,
			significanceTestResult,
			activeTaskIds,
			significanceFailed,
			runSignificance,
			cancelRun,
			isCanceled,
			refutationType,
		} = useBusinessLogic()

		const {
			config,
			onMouseOver,
			hovered,
			failedRefutationIds,
			vegaWindowDimensions,
		} = useSpecificationCurve()

		if (
			!specificationData.length ||
			(defaultRun &&
				defaultRun?.status?.status !== NodeResponseStatus.Completed)
		) {
			return (
				<EmptyDataPageWarning
					text="To see the summary of the estimates, run and wait a run estimate here: "
					linkText="Estimate causal effects"
					page={Pages.EstimateCausalEffects}
					marginTop
				/>
			)
		}

		return (
			<ContainerFlexColumn data-pw="evaluate-hypothesis-content">
				<Container>
					<CausalQuestion defineQuestion={defineQuestion} />
				</Container>
				<Container>
					<CausalDetails alternativeModels={alternativeModels} />
					<CausalEffects size={CausalEffectSize.Small} {...causalEffects} />
				</Container>
				<Container marginTop>
					<AnalysisSpecifications
						refutationType={refutationType}
						refutationLength={refutationLength}
						specificationLength={specificationData.length}
					/>
					<ResultsGraph
						refutationType={refutationType}
						specificationData={specificationData}
						defineQuestion={defineQuestion}
						specificationCurveConfig={config}
						vegaWindowDimensions={vegaWindowDimensions}
						onMouseOver={onMouseOver}
						hovered={hovered}
						failedRefutationIds={failedRefutationIds}
						activeValues={activeValues}
					/>
				</Container>
				<Container marginTop>
					<PageButtons
						activeTaskIds={activeTaskIds}
						defaultRun={defaultRun}
						significanceTestResult={significanceTestResult}
						significanceFailed={significanceFailed}
						runSignificance={runSignificance}
					/>

					<SignificanceTests
						cancelRun={cancelRun}
						isCanceled={isCanceled}
						significanceTestResult={significanceTestResult}
					/>
				</Container>
			</ContainerFlexColumn>
		)
	},
)
