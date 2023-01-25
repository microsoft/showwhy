/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Label, PrimaryButton, Spinner, SpinnerSize } from '@fluentui/react'
import { memo, useCallback, useMemo, useState } from 'react'
import { useHelpOnMount } from '@datashaper/app-framework'

import { ChartOptionsGroup } from '../../components/ChartOptionsGroup.js'
import { EffectResultPane } from '../../components/EffectResultPane/index.js'
import { EstimatorSelector } from '../../components/EstimatorSelector.js'
import { TreatmentSelector } from '../../components/TreatmentSelector/index.js'
import { useCalculateEstimate } from '../../hooks/useCalculateEstimate.js'
import { useCannotCalculateEstimate } from '../../hooks/useCannotCalculateEstimate.js'
import { useCannotCalculatePlacebo } from '../../hooks/useCannotCalculatePlacebo.js'
import { useCheckCanExecuteEstimator } from '../../hooks/useCheckCanExecuteEstimator.js'
import { useUnitCheckboxListItems } from '../../hooks/useChekeableUnits.js'
import { useGenerateErrorMessage } from '../../hooks/useGenerateErrorMessage.js'
import { useHandleRemoveCheckedUnit } from '../../hooks/useHandleRemoveCheckedUnit.js'
import { useOutputData } from '../../hooks/useOutputData.js'
import { useProcessedInputData } from '../../hooks/useProcessedInputData.js'
import {
	useChartOptionsState,
	useCheckedUnitsValueState,
	useColumnMappingValueState,
	useEstimatorState,
	useTimeAlignmentValueState,
	useUserMessageValueState,
} from '../../state/index.js'
import {
	ConfigContainer,
	Container,
	GraphContainer,
	Page,
	StepTitle,
} from '../../styles/index.js'
import { FilterData } from './components/FilterData.js'
import { UnitSelector } from './components/UnitSelector.js'
import { ErrorIcon } from './EstimateEffects.styles.js'
import { processSynthControlData } from './EstimateEffects.utils.js'

export const EstimateEffects: React.FC = memo(
	function EstimateEffects() {
		useHelpOnMount('estimate')
		const [isLoading, setIsLoading] = useState(false)

		const columnMapping = useColumnMappingValueState()
		const userMessage = useUserMessageValueState()
		const timeAlignment = useTimeAlignmentValueState()
		const checkedUnits = useCheckedUnitsValueState()
		const [chartOptions, setChartOptions] = useChartOptionsState()
		const [estimator, setEstimator] = useEstimatorState()

		const outputData = useOutputData()
		const { data, isDataLoaded, globalDateRange } =
			useProcessedInputData(columnMapping)
		const unitCheckboxListItems = useUnitCheckboxListItems(data)
		const checkableUnits = unitCheckboxListItems.map(unit => unit.name)

		const handleRemoveCheckedUnit = useHandleRemoveCheckedUnit()
		const cannotCalculateEstimate = useCannotCalculateEstimate(isLoading)
		const cannotCalculatePlacebo = useCannotCalculatePlacebo(isLoading)
		const generateErrorMessage = useGenerateErrorMessage()
		const checkCanExecuteEstimator = useCheckCanExecuteEstimator(isLoading)
		const calculateEstimate = useCalculateEstimate(
			data,
			isLoading,
			setIsLoading,
		)

		const synthControlData = useMemo(
			() => processSynthControlData(outputData, checkedUnits),
			[outputData, checkedUnits],
		)

		const handleShowError = useCallback(() => {
			if (checkCanExecuteEstimator()) {
				generateErrorMessage()
			}
		}, [checkCanExecuteEstimator, generateErrorMessage])

		const showError = useMemo<boolean>(
			() =>
				isDataLoaded &&
				cannotCalculateEstimate &&
				cannotCalculatePlacebo &&
				!isLoading,
			[
				isDataLoaded,
				cannotCalculateEstimate,
				cannotCalculatePlacebo,
				isLoading,
			],
		)

		return (
			<Page isGrid>
				<ConfigContainer isFlex>
					<UnitSelector data={data} />

					<Container>
						<Label>Treated unit(s) and Treatment period(s)</Label>
						<TreatmentSelector data={data} />
					</Container>

					<FilterData
						isDataLoaded={isDataLoaded}
						globalDateRange={globalDateRange}
					/>

					<EstimatorSelector
						estimator={estimator}
						onEstimatorChange={setEstimator}
					/>

					<Container>
						<PrimaryButton
							disabled={cannotCalculateEstimate}
							text="Calculate causal estimate"
							onClick={() => void calculateEstimate()}
						/>
						{isLoading && <Spinner size={SpinnerSize.medium} />}
						{showError && (
							<ErrorIcon iconName="Info" onClick={handleShowError} />
						)}
					</Container>

					<Container>
						<StepTitle>Chart options</StepTitle>
						<ChartOptionsGroup
							options={chartOptions}
							onChange={setChartOptions}
						/>
					</Container>
				</ConfigContainer>
				<GraphContainer>
					<EffectResultPane
						inputData={data}
						outputData={outputData}
						synthControlData={synthControlData}
						statusMessage={userMessage}
						isLoading={isLoading}
						timeAlignment={timeAlignment}
						checkableUnits={checkableUnits}
						onRemoveCheckedUnit={handleRemoveCheckedUnit}
					/>
				</GraphContainer>
			</Page>
		)
	},
)
