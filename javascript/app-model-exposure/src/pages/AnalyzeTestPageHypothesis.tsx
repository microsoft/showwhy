/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import React, { memo, useMemo } from 'react'
import { Else, If, Then } from 'react-if'

import { isStatus } from '../api-client/utils.js'
import { AnalysisSummary } from '../components/AnalysisSummary.js'
import { CausalQuestion } from '../components/CausalQuestion.js'
import { MessageContainer } from '../components/MessageContainer.js'
import { RunManagement } from '../components/RunManagement.js'
import { SignificanceTestResult } from '../components/SignificanceTestResult.js'
import { Container, Text } from '../components/styles.js'
import { useAlternativeModels } from '../hooks/causalFactors.js'
import {
	useLoadSpecificationData,
	useSpecificationCurveData,
} from '../hooks/estimate/specificationCurveManagement.js'
import { useSignificanceTestData } from '../hooks/hypothesis/useSignificanceTestData.js'
import { useSignificanceTestManagement } from '../hooks/hypothesis/useSignificanceTestManagement.js'
import { useRefutationOptions } from '../hooks/refutation.js'
import { useDefaultRun } from '../hooks/runHistory.js'
import { useCausalQuestion } from '../state/causalQuestion.js'
import { useDefinitions } from '../state/definitions.js'
import { useEstimators } from '../state/estimators.js'
import { usePrimarySpecificationConfig } from '../state/primarySpecificationConfig.js'
import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { Maybe } from '../types/primitives.js'
import { Box, PageSection } from './AnalyzeTestPage.styles.js'

export const AnalyzeTestPageHypothesis: React.FC = memo(
	function AnalyzeTestPageHypothesis() {
		const definitions = useDefinitions()
		const question = useCausalQuestion()
		const refutationOptions = useRefutationOptions()
		const estimators = useEstimators()
		const defaultRun = useDefaultRun()
		const primarySpecificationConfig = usePrimarySpecificationConfig()
		const alternativeModels = useAlternativeModels(
			primarySpecificationConfig.causalModel,
		)
		const specificationData = useLoadSpecificationData()

		const {
			config,
			failedRefutationTaskIds,
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

		const showEmptyPage = useMemo((): boolean => {
			return !!(
				!specificationData.length ||
				(defaultRun &&
					!isStatus(defaultRun?.status, NodeResponseStatus.Success))
			)
		}, [specificationData, defaultRun])

		return (
			<If condition={showEmptyPage}>
				<Then>
					<EmptyDataPageWarning
						text="To test the statistical significance of your estimates, wait for the server run to complete"
						marginTop
					/>
				</Then>
				<Else>
					<PageSection>
						<CausalQuestion question={question} />
						{taskIdsChanged && <NewTaskIdsMessage />}
						<Box>
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
						</Box>
						<Box>
							<AnalysisSummary
								activeEstimatedEffects={activeEstimatedEffects}
								estimators={estimators}
								definitions={definitions}
								refutationOptions={refutationOptions}
								alternativeModels={alternativeModels}
							/>
						</Box>
					</PageSection>
				</Else>
			</If>
		)
	},
)

const EmptyDataPageWarning: React.FC<{
	text: string
	linkText?: string
	marginTop?: Maybe<boolean>
}> = memo(function EmptyDataPageWarning({ text, marginTop = false }) {
	return (
		<Container marginTop={marginTop}>
			<Text>{text}</Text>
		</Container>
	)
})

const NewTaskIdsMessage: React.FC = memo(function NewTaskIdsMessage() {
	return (
		<MessageContainer styles={{ marginBottom: '1rem' }}>
			<span>
				Looks like the active specifications list changed and this result is not
				accurate anymore. Run a new significance test to get an updated result.
			</span>
		</MessageContainer>
	)
})
