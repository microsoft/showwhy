/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { isStatus } from '@showwhy/api-client'
import { ErrorMessage } from '@showwhy/components'
import { NodeResponseStatus } from '@showwhy/types'
import { memo, useEffect, useMemo } from 'react'
import styled from 'styled-components'

import { RunProgressIndicator } from '~components/RunProgressIndicator'
import {
	useAutomaticWorkflowStatus,
	useMicrodataInfoMessage,
	useSpecificationCurve,
	useSubjectIdentifierMissingMessage,
	useVariablesMissingMessage,
} from '~hooks'
import { ContainerFlexColumn, ContainerFlexRow, Title } from '~styles'

import { useEstimateLogic } from './EstimateCausalEffectPage.hooks'
import { EstimatedEffectOptions } from './EstimatedEffectOptions'
import { SpecificationDescription } from './SpecificationDescription'
import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const EstimateCausalEffectPage: React.FC = memo(
	function EstimateCausalEffectPage() {
		const MicrodataMessage = useMicrodataInfoMessage()
		const VariablesMissingMessage = useVariablesMissingMessage()
		const IdentifierMessage = useSubjectIdentifierMissingMessage()
		const { setDone, setTodo } = useAutomaticWorkflowStatus()

		const {
			isProcessing,
			totalEstimatorsCount,
			runEstimate,
			refutationOptions,
			cancelRun,
			isCanceled,
			errors,
			loadingSpecCount,
			specCount,
			loadingFile,
		} = useEstimateLogic()

		const hasErrorMessage = useMemo((): boolean => {
			return !!(
				VariablesMissingMessage ||
				MicrodataMessage ||
				IdentifierMessage
			)
		}, [VariablesMissingMessage, MicrodataMessage, IdentifierMessage])

		const {
			data,
			defaultRun,
			activeProcessing,
			selectedSpecification,
			setSelectedSpecification,
			config,
			onSpecificationsChange,
			onMouseOver,
			hovered,
			handleShapTicksChange,
			handleConfidenceIntervalTicksChange,
			isShapDisabled,
			isConfidenceIntervalDisabled,
			failedRefutationIds,
			vegaWindowDimensions,
			theme,
			outcome,
			isSpecificationOn,
			refutationNumbers,
			failedRefutations,
			onToggleRejectEstimate,
			totalSpecs,
		} = useSpecificationCurve()

		useEffect(() => {
			!isStatus(defaultRun?.status?.status, NodeResponseStatus.Completed)
				? setTodo()
				: setDone()
		}, [defaultRun, setDone, setTodo])

		return (
			<ContainerFlexRow>
				<Main>
					<ContainerFlexRow justifyContent="space-between">
						<EstimatesContainer>
							<Title>Estimate causal effects</Title>
							{VariablesMissingMessage}
							{MicrodataMessage}
							{IdentifierMessage}
							{!isProcessing && (
								<Container>
									<PrimaryButton
										disabled={
											loadingSpecCount ||
											!totalEstimatorsCount ||
											!specCount ||
											hasErrorMessage ||
											loadingFile
										}
										onClick={runEstimate}
										data-pw="run-estimate-button"
									>
										{loadingFile ? 'Loading...' : 'Run now'}
									</PrimaryButton>
									{!loadingSpecCount ? (
										<Text>{specCount || 0} specifications to analyze</Text>
									) : (
										loadingSpecCount && (
											<Text>Loading specifications count...</Text>
										)
									)}
									{!!errors && <ErrorMessage log={errors} />}
								</Container>
							)}
							{!activeProcessing && defaultRun && defaultRun.status.error && (
								<ErrorMessage
									message={'Undefined error. Please, execute the run again.'}
									log={defaultRun.status.error}
								/>
							)}
							{activeProcessing && (
								<RunProgressIndicator
									run={activeProcessing}
									theme={theme}
									cancelRun={!isCanceled && cancelRun ? cancelRun : undefined}
									props={
										isCanceled
											? {
													description:
														'Canceling run... This could take a few seconds.',
													percentComplete: undefined,
											  }
											: undefined
									}
								/>
							)}
						</EstimatesContainer>
						<ContainerFlexColumn marginTop>
							<EstimatedEffectOptions
								label="Confidence interval"
								title="Enable confidence interval ticks"
								disabledTitle="Confidence interval ticks are not enabled for this run"
								checked={config.confidenceIntervalTicks}
								disabled={isConfidenceIntervalDisabled}
								onChange={handleConfidenceIntervalTicksChange}
							/>
							<EstimatedEffectOptions
								disabled={isShapDisabled}
								label="Element contribution"
								title="Enable shap ticks"
								disabledTitle="Shap ticks are not available while active run is processing"
								checked={config.shapTicks}
								onChange={handleShapTicksChange}
							/>
						</ContainerFlexColumn>
					</ContainerFlexRow>
					<VegaSpecificationCurve
						data={data}
						config={config}
						width={vegaWindowDimensions.width}
						height={vegaWindowDimensions.height}
						onConfigChange={onSpecificationsChange}
						onSpecificationSelect={setSelectedSpecification}
						onMouseOver={onMouseOver}
						hovered={hovered}
						outcome={outcome}
						failedRefutationIds={failedRefutationIds}
						totalSpecs={totalSpecs}
					/>
					<SpecificationDescription
						refutationOptions={refutationOptions}
						specification={selectedSpecification}
						isSpecificationOn={isSpecificationOn}
						refutationNumbers={refutationNumbers}
						failedRefutations={failedRefutations}
						onToggleRejectEstimate={onToggleRejectEstimate}
					/>
				</Main>
			</ContainerFlexRow>
		)
	},
)

const EstimatesContainer = styled.div`
	width: 80%;
`

const Main = styled.div`
	flex: 4;
`

const Text = styled.span`
	margin-left: 10px;
`

const Container = styled.div``
