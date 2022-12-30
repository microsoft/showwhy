/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { MultiDropdown } from '@essex/components'
import {
	type IDropdownOption,
	Checkbox,
	FontIcon,
	Label,
	PrimaryButton,
	Spinner,
	SpinnerSize,
	Stack,
	Text,
	TooltipHost,
} from '@fluentui/react'
import React, {
	type FormEvent,
	memo,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'

import { ChartOptionsGroup } from '../../components/ChartOptionsGroup.js'
import { EffectResultPane } from '../../components/EffectResultPane/index.js'
import { EstimatorSelector } from '../../components/EstimatorSelector.js'
import { RangeFilter } from '../../components/RangeFilter.js'
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
	useCheckedUnitsState,
	useColumnMappingValueState,
	useEstimatorState,
	useFilterValueState,
	useTimeAlignmentValueState,
	useTreatedUnitsValueState,
	useUserMessageValueState,
} from '../../state/index.js'
import {
	Page,
	Spacer,
	StepDescription,
	StepTitle,
	tooltipHostStyles,
} from '../../styles/index.js'
import { isValidTreatedUnits } from '../../utils/validation.js'
import {
	useControlUnitsIntermediateChecked,
	useFilterDataHandler,
	useHandleSelectAllUnits,
	useMultiDropdownOptions,
	useResetDataHandler,
} from './EstimateEffects.hooks.js'
import { processSynthControlData } from './EstimateEffects.utils.js'

export const EstimateEffects: React.FC = memo(function EstimateEffects() {
	const [isLoading, setIsLoading] = useState(false)

	const filter = useFilterValueState()
	const columnMapping = useColumnMappingValueState()
	const treatedUnits = useTreatedUnitsValueState()
	const userMessage = useUserMessageValueState()
	const timeAlignment = useTimeAlignmentValueState()
	const [checkedUnits, setCheckedUnits] = useCheckedUnitsState()
	const [chartOptions, setChartOptions] = useChartOptionsState()
	const [estimator, setEstimator] = useEstimatorState()

	const outputData = useOutputData()
	const { data, isDataLoaded, globalDateRange } =
		useProcessedInputData(columnMapping)
	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const checkableUnits = unitCheckboxListItems.map(unit => unit.name)

	const handleRemoveCheckedUnit = useHandleRemoveCheckedUnit()
	const validTreatedUnits = isValidTreatedUnits(treatedUnits)
	const filterDataHandler = useFilterDataHandler(isDataLoaded)
	const controlUnitsIntermediateChecked =
		useControlUnitsIntermediateChecked(data)
	const handleSelectAllUnits = useHandleSelectAllUnits(data)
	const resetDataHandler = useResetDataHandler(isDataLoaded)
	const cannotCalculateEstimate = useCannotCalculateEstimate(isLoading)
	const cannotCalculatePlacebo = useCannotCalculatePlacebo(isLoading)
	const generateErrorMessage = useGenerateErrorMessage()
	const checkCanExecuteEstimator = useCheckCanExecuteEstimator(isLoading)
	const multiDropdownOptions = useMultiDropdownOptions(data)
	const calculateEstimate = useCalculateEstimate(data, isLoading, setIsLoading)

	const synthControlData = useMemo(
		() => processSynthControlData(outputData, checkedUnits),
		[outputData, checkedUnits],
	)

	const controlUnitsChecked = useMemo(() => {
		return checkedUnits
			? validTreatedUnits
				? checkedUnits.size - treatedUnits.length ===
				  unitCheckboxListItems.length
				: checkedUnits.size === unitCheckboxListItems.length
			: false
	}, [checkedUnits, validTreatedUnits, unitCheckboxListItems, treatedUnits])

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
		[isDataLoaded, cannotCalculateEstimate, cannotCalculatePlacebo, isLoading],
	)

	const onChange = useCallback(
		(_: FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
			setCheckedUnits(prev => {
				const set = new Set(prev || [])
				if (!option) return set
				if (set.has(option.key as string)) {
					set.delete(option.key as string)
				} else {
					set.add(option.key as string)
				}
				return set
			})
		},
		[setCheckedUnits],
	)

	const onChangeAll = useCallback(
		(_: React.MouseEvent, options?: IDropdownOption[]) => {
			setCheckedUnits(
				options?.length ? new Set(options.map(o => o.key as string)) : null,
			)
		},
		[setCheckedUnits],
	)

	useEffect(() => {
		if (checkedUnits === null && data.uniqueUnits.length) {
			setCheckedUnits(new Set(data.uniqueUnits))
		}
	}, [data, checkedUnits, setCheckedUnits])

	return (
		<Page>
			<Stack tokens={{ childrenGap: 5 }}>
				<Stack
					horizontal
					tokens={{ childrenGap: 5 }}
					className="unit-selection-header"
				>
					<StepTitle>Unit selection</StepTitle>
					<Checkbox
						label="Select All/None"
						checked={controlUnitsChecked}
						indeterminate={controlUnitsIntermediateChecked}
						onChange={handleSelectAllUnits}
					/>
				</Stack>
				<StepDescription>
					Include or exclude units from the pool of data that can be used to
					generate our synthetic control.
				</StepDescription>
				<MultiDropdown
					selectedKeys={Array.from(checkedUnits || [])}
					options={multiDropdownOptions}
					onChange={onChange}
					onChangeAll={onChangeAll}
				/>
			</Stack>

			<Spacer axis="vertical" size={5} />

			<Label>Treated unit(s) and Treatment period(s)</Label>
			<TreatmentSelector data={data} />

			<Spacer axis="vertical" size={15} />

			<Stack>
				<Label>
					<StepTitle>Filter data</StepTitle>
					<TooltipHost
						content="Use the Start/End dates to customize and filter the data range"
						id="filterDataTooltipId"
						styles={tooltipHostStyles}
					>
						<FontIcon
							iconName="Info"
							className="filter-data-icon"
							aria-describedby="filterDataTooltipId"
						/>
					</TooltipHost>
				</Label>
				<Spacer axis="vertical" size={5} />
				<Text>
					Constrain the time before and after the event used to calculate the
					causal effect
				</Text>
				<Spacer axis="vertical" size={5} />
				<RangeFilter
					defaultRange={filter && [filter.startDate, filter.endDate]}
					labelStart="Start date"
					labelEnd="End date"
					min={globalDateRange.startDate}
					max={globalDateRange.endDate}
					step={1}
					onApply={filterDataHandler}
					onReset={resetDataHandler}
				/>
			</Stack>

			<Spacer axis="vertical" size={15} />

			<EstimatorSelector
				estimator={estimator}
				onEstimatorChange={setEstimator}
			/>

			<Spacer axis="vertical" size={5} />

			<Stack tokens={{ childrenGap: 5 }}>
				<Stack horizontal grow tokens={{ childrenGap: 5 }}>
					<PrimaryButton
						disabled={cannotCalculateEstimate}
						text="Calculate causal estimate"
						onClick={() => void calculateEstimate()}
					/>
					{isLoading && <Spinner size={SpinnerSize.medium} />}
					{showError && (
						<FontIcon
							iconName="Info"
							className="bad-input"
							onClick={handleShowError}
						/>
					)}
				</Stack>
			</Stack>
			<Spacer axis="vertical" size={20} />

			<StepTitle>Chart options</StepTitle>
			<Stack tokens={{ childrenGap: 5, padding: 5 }}>
				<ChartOptionsGroup options={chartOptions} onChange={setChartOptions} />
			</Stack>

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
		</Page>
	)
})
