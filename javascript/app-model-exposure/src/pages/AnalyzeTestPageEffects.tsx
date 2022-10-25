/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { PrimaryButton } from '@fluentui/react'
import { useThematicFluent } from '@thematic/fluent'
import React, { memo } from 'react'
import styled from 'styled-components'

import { ErrorInfo } from '../components/ErrorInfo.js'
import {
	ColumnDataTypeMessage,
	IdentifierMessage,
	MicrodataMessage,
	OutputTableColumnsMessage,
	VariablesMessage,
} from '../components/ErrorMessages.js'
import { EstimatedEffectConfig } from '../components/EstimateEffectConfig.js'
import { EstimatorsRunProgress } from '../components/EstimatorsRunProgress.js'
import { SpecificationDescription } from '../components/SpecificationDescription.js'
import { SpecificationGraphs } from '../components/SpecificationGraphs.js'
import { Title } from '../components/styles.js'
import { useSpecificationCurveData } from '../hooks/estimate/specificationCurveManagement.js'
import { useDataErrors } from '../hooks/estimate/useDataErrors.js'
import { useEstimateLogic } from '../hooks/estimate/useEstimateLogic.js'
import { useSpecificationCurve } from '../hooks/estimate/useSpecificationCurve.js'
import { useRefutationOptions } from '../hooks/refutation.js'
import {
	useDefaultRun,
	useIsDefaultRunProcessing,
} from '../hooks/runHistory.js'
import { useGetRunStatus } from '../hooks/runStatus.js'
import { Box, BoxGroup, PageSection, Text } from './AnalyzeTestPage.styles.js'

export const AnalyzeTestPageEffects: React.FC = memo(
	function AnalyzeTestPageEffects() {
		const theme = useThematicFluent()
		const defaultRun = useDefaultRun()
		const runStatus = useGetRunStatus(defaultRun)
		const isProcessing = useIsDefaultRunProcessing()
		const refutationOptions = useRefutationOptions()

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
		} = useSpecificationCurve(data)

		return (
			<PageSection>
				<Title>Estimate causal effects</Title>
				{isMissingVariable && <VariablesMessage />}
				{isMissingIdentifier && <IdentifierMessage />}
				{!isMicrodata && <MicrodataMessage />}
				{isNotInOutputTable && <OutputTableColumnsMessage />}
				{!isValidDataType && <ColumnDataTypeMessage />}
				<BoxGroup justifyContent="space-between">
					<Box>
						{!isProcessing && (
							<Container>
								<PrimaryButton
									/* eslint-disable @typescript-eslint/no-misused-promises */
									onClick={runEstimate}
									data-pw="run-estimate-button"
									disabled={
										loadingSpecCount || !specCount || hasAnyError || loadingFile
									}
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
						{!activeProcessing && defaultRun && defaultRun.error && (
							<ErrorInfo
								text={'Undefined error. Please, execute the run again.'}
								log={defaultRun.error}
							/>
						)}
					</Box>
					{activeProcessing && (
						<EstimatorsRunProgress
							runStatus={runStatus}
							run={activeProcessing}
							theme={theme}
							cancelRun={!isCanceled ? cancelRun : undefined}
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
					<Box>
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
					</Box>
				</BoxGroup>
				<Box>
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
						confounderThreshold={defaultRun?.confounderThreshold}
						onToggleRejectEstimate={onToggleRejectEstimate}
					/>
				</Box>
			</PageSection>
		)
	},
)

const Container = styled.div``
