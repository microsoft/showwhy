/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { isStatus } from '@showwhy/api-client'
import {
	ContainerFlexColumn,
	ContainerFlexRow,
	ErrorMessage,
	RunProgressIndicator,
	Title,
} from '@showwhy/components'
import { NodeResponseStatus } from '@showwhy/types'
import { useThematic } from '@thematic/react'
import { memo, useEffect } from 'react'
import styled from 'styled-components'

import {
	useAutomaticWorkflowStatus,
	useDefaultRun,
	useIsDefaultRunProcessing,
	useRefutationOptions,
	useSpecificationCurveData,
} from '~hooks'
import { useEstimators } from '~state'

import {
	IdentifierMessage,
	MicrodataMessage,
	VariablesMessage,
} from './ErrorMessages'
import { EstimatedEffectConfig } from './EstimatedEffectConfig'
import { useDataErrors } from './hooks/useDataErrors'
import { useEstimateLogic } from './hooks/useEstimateLogic'
import { useSpecificationCurve } from './hooks/useSpecificationCurve'
import { SpecificationDescription } from './SpecificationDescription'
import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const EstimateCausalEffectPage: React.FC = memo(
	function EstimateCausalEffectPage() {
		const { setDone, setTodo } = useAutomaticWorkflowStatus()
		const theme = useThematic()
		const isProcessing = useIsDefaultRunProcessing()
		const estimators = useEstimators()
		const refutationOptions = useRefutationOptions()
		const defaultRun = useDefaultRun()

		const {
			runEstimate,
			cancelRun,
			isCanceled,
			errors,
			loadingSpecCount,
			specCount,
			loadingFile,
		} = useEstimateLogic(isProcessing)

		const { isMicrodata, isMissingVariable, isMissingIdentifier, hasAnyError } =
			useDataErrors()

		const {
			data,
			config,
			onMouseOver,
			hovered,
			failedRefutationIds,
			vegaWindowDimensions,
			outcome,
			activeProcessing,
		} = useSpecificationCurveData()

		const {
			selectedSpecification,
			setSelectedSpecification,
			onSpecificationsChange,
			handleShapTicksChange,
			handleConfidenceIntervalTicksChange,
			isShapDisabled,
			isConfidenceIntervalDisabled,
			isSpecificationOn,
			refutationNumbers,
			failedRefutations,
			onToggleRejectEstimate,
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
							{isMissingVariable && <VariablesMessage />}
							{isMissingIdentifier && <IdentifierMessage />}
							{!isMicrodata && <MicrodataMessage />}
							{!isProcessing && (
								<Container>
									<PrimaryButton
										disabled={
											loadingSpecCount ||
											estimators.length === 0 ||
											!specCount ||
											hasAnyError ||
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
							<EstimatedEffectConfig
								config={config}
								handleConfidenceIntervalTicksChange={
									handleConfidenceIntervalTicksChange
								}
								handleShapTicksChange={handleShapTicksChange}
								isConfidenceIntervalDisabled={isConfidenceIntervalDisabled}
								isShapDisabled={isShapDisabled}
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
						totalSpecs={specCount}
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
