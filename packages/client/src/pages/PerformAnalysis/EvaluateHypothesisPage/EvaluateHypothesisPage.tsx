/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import { AnalysisSpecifications } from './AnalysisSpecifications'
import { CausalDetails } from './CausalDetails'
import { PageButtons } from './PageButtons'
import { ResultsGraph } from './ResultsGraph'
import { SignificanceTests } from './SignificanceTests'
import { useBusinessLogic } from './hooks'
import { CausalEffects } from '~components/CausalEffects'
import { CausalQuestion } from '~components/CausalQuestion'
import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { Pages, Size } from '~enums'
import { useSpecificationCurve } from '~hooks'
import { Container, ContainerFlexColumn } from '~styles'
import { NodeResponseStatus } from '~interfaces'

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
			significanceTestsResult,
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
			<ContainerFlexColumn>
				<Container>
					<CausalQuestion defineQuestion={defineQuestion} />
				</Container>
				<Container>
					<CausalDetails alternativeModels={alternativeModels} />
					<CausalEffects size={Size.Small} {...causalEffects} />
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
						significanceTestsResult={significanceTestsResult}
						significanceFailed={significanceFailed}
						runSignificance={runSignificance}
					/>

					<SignificanceTests
						cancelRun={cancelRun}
						isCanceled={isCanceled}
						significanceTestsResult={significanceTestsResult}
					/>
				</Container>
			</ContainerFlexColumn>
		)
	},
)
