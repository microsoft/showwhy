/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Checkbox } from '@fluentui/react'
import React, { memo, useMemo } from 'react'

import { RawDataPane } from '../../components/RawDataPane.js'
import { useUnitCheckboxListItems } from '../../hooks/useChekeableUnits.js'
import { useHandleRemoveCheckedUnit } from '../../hooks/useHandleRemoveCheckedUnit.js'
import { useOutputData } from '../../hooks/useOutputData.js'
import { useProcessedInputData } from '../../hooks/useProcessedInputData.js'
import {
	useChartOptionsState,
	useColumnMappingValueState,
	useRawDataValueState,
	useUserMessageValueState,
} from '../../state/index.js'
import {
	ConfigContainer,
	Container,
	GraphContainer,
	Page,
	Spacer,
	StepTitle,
} from '../../styles/index.js'
import { getColumns } from '../../utils/csv.js'
import { CausalQuestion } from './components/CausalQuestion.js'
import { DataColumns } from './components/DataColumns.js'
import { Hypothesis } from './components/Hypothesis.js'
import { LoadDataset } from './components/LoadDataset.js'
import { TreatedUnits } from './components/TreatedUnits.js'

export const PrepareAnalysis: React.FC = memo(function PrepareAnalysis() {
	const rawData = useRawDataValueState()
	const userMessage = useUserMessageValueState()

	const [chartOptions, setChartOptions] = useChartOptionsState()
	const columnMapping = useColumnMappingValueState()

	const outputData = useOutputData()
	const handleRemoveCheckedUnit = useHandleRemoveCheckedUnit()

	const { data, defaultTreatment, updateTreatmentsForAggregation } =
		useProcessedInputData(columnMapping)
	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const checkableUnits = unitCheckboxListItems.map(unit => unit.name)

	const columnsDropdownOptions = useMemo((): IDropdownOption[] => {
		return getColumns(rawData).map(v => ({
			key: v,
			text: v,
		}))
	}, [rawData])

	return (
		<Page isGrid>
			<ConfigContainer>
				<LoadDataset />

				<Spacer axis="vertical" size={15} />

				<DataColumns data={data} options={columnsDropdownOptions} />

				<TreatedUnits
					data={data}
					options={columnsDropdownOptions}
					defaultTreatment={defaultTreatment}
					updateTreatmentsForAggregation={updateTreatmentsForAggregation}
				/>
				<CausalQuestion />
				<Hypothesis />

				<Container>
					<StepTitle>Chart options</StepTitle>
					<Checkbox
						label="Show treatment start indicator"
						checked={chartOptions.showTreatmentStart}
						onChange={(e, isChecked) =>
							setChartOptions({
								...chartOptions,
								showTreatmentStart: !!isChecked,
							})
						}
					/>
				</Container>
			</ConfigContainer>

			<GraphContainer>
				<RawDataPane
					inputData={data}
					outputData={outputData}
					statusMessage={userMessage}
					checkableUnits={checkableUnits}
					onRemoveCheckedUnit={handleRemoveCheckedUnit}
				/>
			</GraphContainer>
		</Page>
	)
})
