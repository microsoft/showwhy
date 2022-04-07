/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { memo } from 'react'
import styled from 'styled-components'

import { EmptyDataPageWarning } from '~components/EmptyDataPageWarning'
import { ErrorMessage } from '~components/ErrorMessage'
import { RunProgressIndicator } from '~components/RunProgressIndicator'
import { useRefutationOptions, useSpecificationCurve } from '~hooks'
import { ContainerFlexColumn, ContainerFlexRow, Title } from '~styles'
import { Pages } from '~types'

import { EstimatedEffectOptions } from './EstimatedEffectOptions'
import { SpecificationDescription } from './SpecificationDescription'
import { VegaSpecificationCurve } from './vega/VegaSpecificationCurve'

export const ExploreSpecificationCurvePage: React.FC = memo(
	function SpecificationCurve() {
		const refutationOptions = useRefutationOptions()
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

		if (!data.length && !defaultRun) {
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
			<ContainerFlexRow>
				<Main>
					<ContainerFlexRow justifyContent="space-between">
						<EstimatesContainer>
							<Title>
								Specification curve analysis of causal effect estimates
							</Title>
							{!activeProcessing && defaultRun && defaultRun.status.error && (
								<ErrorMessage>{defaultRun.status.error}</ErrorMessage>
							)}
							{activeProcessing && (
								<RunProgressIndicator theme={theme} run={activeProcessing} />
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
