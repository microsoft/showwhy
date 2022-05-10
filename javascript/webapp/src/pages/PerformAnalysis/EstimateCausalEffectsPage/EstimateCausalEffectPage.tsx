/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { isStatus } from '@showwhy/api-client'
import {
	ContainerFlexColumn,
	ContainerFlexRow,
	ErrorInfo,
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
	ColumnDataTypeMessage,
	IdentifierMessage,
	MicrodataMessage,
	OutputTableColumnsMessage,
	VariablesMessage,
} from './components/ErrorMessages'
import { EstimatedEffectConfig } from './components/EstimatedEffectConfig'
import { EstimatorsRunProgress } from './components/EstimatorsRunProgress'
import { SpecificationDescription } from './components/SpecificationDescription'
import { SpecificationGraphs } from './components/SpecificationGraphs'
import { useDataErrors } from './hooks/useDataErrors'
import { useEstimateLogic } from './hooks/useEstimateLogic'
import { useSpecificationCurve } from './hooks/useSpecificationCurve'

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

		const {
			isMicrodata,
			isMissingVariable,
			isMissingIdentifier,
			isNotInOutputTable,
			isValidDataType,
			hasAnyError,
		} = useDataErrors()

		const {
			data,
			config,
			onMouseOver,
			hovered,
			failedRefutationTaskIds,
			vegaWindowDimensions,
			outcomeOptions,
			activeProcessing,
			selectedOutcome,
			setSelectedOutcome,
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
							{isNotInOutputTable && <OutputTableColumnsMessage />}
							{!isValidDataType && <ColumnDataTypeMessage />}
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
									{!!errors && <ErrorInfo log={errors} />}
								</Container>
							)}
							{!activeProcessing && defaultRun && defaultRun.status.error && (
								<ErrorInfo
									text={'Undefined error. Please, execute the run again.'}
									log={defaultRun.status.error}
								/>
							)}
							{activeProcessing && (
								<EstimatorsRunProgress
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
								defaultRun={defaultRun}
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
					<SpecificationGraphs
						data={data}
						config={config}
						vegaWindowDimensions={vegaWindowDimensions}
						onSpecificationsChange={onSpecificationsChange}
						setSelectedSpecification={setSelectedSpecification}
						onMouseOver={onMouseOver}
						hovered={hovered}
						outcomeOptions={outcomeOptions}
						failedRefutationTaskIds={failedRefutationTaskIds}
						specCount={specCount}
						selectedOutcome={selectedOutcome}
						setSelectedOutcome={setSelectedOutcome}
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

const Main = styled.div`
	flex: 4;
`

const Text = styled.span`
	margin-left: 10px;
`

const Container = styled.div``

const EstimatesContainer = styled.div`
	flex: 1;
	margin-right: 20px;
`
