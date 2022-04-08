/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { memo, useMemo } from 'react'
import styled from 'styled-components'

import { ErrorMessage } from '~components/ErrorMessage'
import { RunProgressIndicator } from '~components/RunProgressIndicator'
import { useSpecificationCurve } from '~hooks'
import { ContainerFlexColumn, ContainerFlexRow, Title } from '~styles'

import {
	useBusinessLogic,
	useInfoMessage,
	useMicrodataInfoMessage,
} from '../EstimateCausalEffectsPage/hooks'
import { EstimatedEffectOptions } from './EstimatedEffectOptions'
import { SpecificationDescription } from './SpecificationDescription'
import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const ExploreSpecificationCurvePage: React.FC = memo(
	function SpecificationCurve() {
		const InfoMessage = useInfoMessage()
		const MicrodataMessage = useMicrodataInfoMessage()

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
		} = useBusinessLogic()

		const hasErrorMessage = useMemo((): boolean => {
			return !!(InfoMessage || MicrodataMessage)
		}, [InfoMessage, MicrodataMessage])

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

		return (
			<ContainerFlexRow>
				<Main>
					<ContainerFlexRow justifyContent="space-between">
						<EstimatesContainer>
							<Title>
								Specification curve analysis of causal effect estimates
							</Title>
							{InfoMessage}
							{MicrodataMessage}
							{!isProcessing && (
								<Container>
									<PrimaryButton
										disabled={
											loadingSpecCount ||
											!totalEstimatorsCount ||
											!specCount ||
											hasErrorMessage
										}
										onClick={runEstimate}
										data-pw="run-estimate-button"
									>
										Run now
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
