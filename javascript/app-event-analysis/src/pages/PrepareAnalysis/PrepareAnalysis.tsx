/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useTableBundles } from '@datashaper/app-framework'
import type { IDropdownOption } from '@fluentui/react'
import {
	Checkbox,
	DefaultButton,
	Dropdown,
	FontIcon,
	Label,
	Link,
	Stack,
	Text,
	TextField,
	TooltipHost,
} from '@fluentui/react'
import type { Hypothesis } from '@showwhy/app-common'
import { HypothesisGroup, TableMenuBar } from '@showwhy/app-common'
import { not } from 'arquero'
import { isEqual } from 'lodash'
import type { FormEvent } from 'react'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { RawDataPane } from '../../components/RawDataPane.js'
import { TreatmentSelector } from '../../components/TreatmentSelector/index.js'
import { useUnitCheckboxListItems } from '../../hooks/useChekeableUnits.js'
import { useHandleRemoveCheckedUnit } from '../../hooks/useHandleRemoveCheckedUnit.js'
import { useOutputData } from '../../hooks/useOutputData.js'
import { useProcessedInputData } from '../../hooks/useProcessedInputData.js'
import { useUpdateColumnMapping } from '../../hooks/useUpdateColumnMapping.js'
import { useUpdateTreatmentsForAgg } from '../../hooks/useUpdateTreatmentsForAgg.js'
import {
	useAggregateEnabledState,
	useChartOptionsState,
	useColumnMappingState,
	useEventNameState,
	useFileNameState,
	useHypothesisState,
	useOutcomeNameState,
	useRawDataValueState,
	useTreatedUnitsValueState,
	useUnitsState,
	useUserMessageValueState,
} from '../../state/index.js'
import { Container, Spacer, tooltipHostStyles } from '../../styles/index.js'
import { getColumns } from '../../utils/csv.js'
import { useHandleFileLoad } from './PrepareAnalysis.hooks.js'
import {
	DropdownContainer,
	hypothesisGroupStyles,
} from './PrepareAnalysis.styles.js'

export const PrepareAnalysis: React.FC = memo(function PrepareAnalysis() {
	const dataTables = useTableBundles()
	const [currentTableName, setCurrentTableName] = useState('')
	const userMessage = useUserMessageValueState()

	const [hypothesis, setHypothesis] = useHypothesisState()
	const [units, setUnits] = useUnitsState()

	const rawData = useRawDataValueState()
	const [fileName, setFileName] = useFileNameState()

	const treatedUnits = useTreatedUnitsValueState()

	const [aggregateEnabled, setAggregateEnabled] = useAggregateEnabledState()

	const [columnMapping, setColumnMapping] = useColumnMappingState()
	const [outcomeName, setOutcomeName] = useOutcomeNameState()
	const [eventName, setEventName] = useEventNameState()
	const [chartOptions, setChartOptions] = useChartOptionsState()

	const { data, defaultTreatment, updateTreatmentsForAggregation } =
		useProcessedInputData(columnMapping)

	const unitCheckboxListItems = useUnitCheckboxListItems(data)
	const checkableUnits = unitCheckboxListItems.map(unit => unit.name)
	const handleRemoveCheckedUnit = useHandleRemoveCheckedUnit()
	const outputData = useOutputData()
	const updateColumnMapping = useUpdateColumnMapping()
	const updateTreatmentsForAgg = useUpdateTreatmentsForAgg(
		defaultTreatment,
		updateTreatmentsForAggregation,
	)

	const handleAggregateOption = useCallback(() => {
		const enabled = !aggregateEnabled
		updateTreatmentsForAgg()
		setAggregateEnabled(enabled)
	}, [aggregateEnabled, setAggregateEnabled, updateTreatmentsForAgg])

	const handleFileLoad = useHandleFileLoad()

	const onUnitUpdate = useCallback(
		(value?: IDropdownOption) => {
			const unit = !value ? '' : String(value.key)
			updateColumnMapping({ unit })
			setUnits(prev => (!prev ? unit : prev))
		},
		[setUnits, updateColumnMapping],
	)
	const onDatasetClicked = useCallback(
		(name: string) => {
			const table = dataTables.find(d => d.name === name)?.output?.table
			if (table) {
				setCurrentTableName(name)
				setFileName(name)
				// @FIXME: ideally we should consume the wrangled data-table as is
				//  and not convert it back to CSV before reading its content
				const tableAsCSV = table?.select(not('index')).toCSV()
				handleFileLoad({ fileName: name, content: tableAsCSV })
			}
		},
		[dataTables, handleFileLoad, setCurrentTableName, setFileName],
	)

	const onDataTablesUpdate = useCallback(() => {
		if (fileName !== currentTableName) {
			onDatasetClicked(fileName)
		}
	}, [fileName, currentTableName, onDatasetClicked])

	const columnsDropdownOptions = useMemo((): IDropdownOption[] => {
		return getColumns(rawData).map(v => ({
			key: v,
			text: v,
		}))
	}, [rawData])

	const handleOutColumnChange = (
		e: FormEvent<HTMLDivElement>,
		option?: IDropdownOption<string>,
	) => {
		const outCol = '' + (option?.key.toString() ?? '')
		if (outCol !== '') {
			const newMapping = { ...columnMapping, ...{ value: outCol } }
			if (!isEqual(newMapping, columnMapping)) setColumnMapping(newMapping)
			setOutcomeName(prev => (!prev ? outCol : prev))
		}
	}

	const enableRegroupButton = useMemo(() => {
		const nonGroupedUnits = treatedUnits.filter(
			unit => !unit.startsWith('Group_'),
		)
		return aggregateEnabled && nonGroupedUnits.length > 0
	}, [aggregateEnabled, treatedUnits])

	useEffect(() => {
		onDataTablesUpdate()
	}, [dataTables])

	return (
		<Container>
			<Stack tokens={{ childrenGap: 5 }}>
				<Text className="stepText">Load your data set</Text>
				<Text className="stepDesc">
					Load a dataset in&nbsp;
					<Link href="https://en.wikipedia.org/wiki/Panel_data" target="_blank">
						panel data format
					</Link>
					&nbsp;to get started.
				</Text>
				<Stack horizontal tokens={{ childrenGap: 10 }}>
					<TableMenuBar
						selectedTable={fileName}
						onTableSelected={onDatasetClicked}
					/>
				</Stack>
			</Stack>

			<Spacer axis="vertical" size={15} />

			<Stack tokens={{ childrenGap: 5 }}>
				<Text className="stepText">
					Select time, units, and outcome columns
				</Text>
				<Text className="stepDesc">
					Select data columns representing the time periods (e.g., years) in
					which the units of your analysis (e.g., different regions or groups)
					were observed to have outcomes before and after the treatment/event of
					interest.
				</Text>
				<DropdownContainer>
					<Dropdown
						placeholder="Time"
						label="Time"
						options={columnsDropdownOptions}
						selectedKey={columnMapping.date}
						onChange={(e, val) =>
							updateColumnMapping({
								date: !val ? '' : String(val.key),
							})
						}
					/>
					<Dropdown
						placeholder="Units"
						label="Units"
						options={columnsDropdownOptions}
						selectedKey={columnMapping.unit}
						onChange={(e, val) => onUnitUpdate(val)}
					/>
					<Dropdown
						placeholder="Outcome"
						label="Outcome"
						options={columnsDropdownOptions}
						selectedKey={columnMapping.value}
						onChange={handleOutColumnChange}
					/>
				</DropdownContainer>

				{data.nonBalancedUnits?.length && !!columnMapping.value ? (
					<Stack horizontal tokens={{ childrenGap: 10, padding: 10 }}>
						<Text>
							{data.nonBalancedUnits.length} units missing outcomes have been
							excluded
						</Text>
						<TooltipHost
							content={data.nonBalancedUnits.map((i, key) => (
								<Text
									key={key}
									block
									styles={{ root: { marginBottom: '10px' } }}
								>
									{i}
								</Text>
							))}
							id="nonBalancedUnits"
							styles={tooltipHostStyles}
						>
							<FontIcon
								iconName="Info"
								className="non-balanced-units-icon"
								aria-describedby="nonBalancedUnits"
							/>
						</TooltipHost>
					</Stack>
				) : null}
			</Stack>

			<Spacer axis="vertical" size={15} />

			<Stack tokens={{ childrenGap: 5 }}>
				<Text className="stepText">Define treated units and time periods</Text>
				<Text className="stepDesc">
					Select some units and time-periods to consider as treated.
					Alternatively, if your dataset contains a column specifying a
					treatment, select the column to automatically create treatments.
				</Text>
				<Spacer axis="vertical" size={5} />
				<Stack horizontal horizontalAlign="space-between">
					<Stack.Item align="baseline">
						<Checkbox
							label="Aggregate Treated Units"
							checked={aggregateEnabled}
							onChange={handleAggregateOption}
						/>
					</Stack.Item>
					<DefaultButton
						text="Regroup"
						onClick={updateTreatmentsForAgg}
						disabled={!enableRegroupButton}
					/>
				</Stack>
				<Spacer axis="vertical" size={5} />
				<TreatmentSelector data={data} />
				<Stack tokens={{ padding: 5 }}>
					<Stack.Item align="center">OR</Stack.Item>
				</Stack>
				<Stack horizontal tokens={{ childrenGap: 3 }}>
					<Stack.Item>
						<Label>Automatically create treatments from column:</Label>
					</Stack.Item>
					<Stack.Item grow>
						<Dropdown
							placeholder="Select treated column"
							options={columnsDropdownOptions}
							selectedKey={columnMapping.treated}
							onChange={(e, val) =>
								updateColumnMapping({
									treated: !val ? '' : String(val.key),
								})
							}
						/>
					</Stack.Item>
					<Stack.Item align="center">
						<FontIcon
							iconName="Cancel"
							className="attributeClearSelection"
							onClick={() => {
								updateColumnMapping({ treated: '' })
							}}
						/>
					</Stack.Item>
				</Stack>
			</Stack>

			<Spacer axis="vertical" size={15} />

			<Stack>
				<Text className="stepText">Format causal question</Text>
				<Stack horizontal>
					<Stack tokens={{ childrenGap: 5, padding: 10 }}>
						<Text className="stepText">Units</Text>
						<TextField
							placeholder="Units"
							value={units}
							onChange={(e, v) => setUnits(v || '')}
						/>
					</Stack>
					<Stack tokens={{ childrenGap: 5, padding: 10 }}>
						<Text className="stepText">Treatment/Event</Text>
						<TextField
							placeholder="Treatment/Event"
							value={eventName}
							onChange={(e, v) => setEventName(v || '')}
						/>
					</Stack>
					<Stack tokens={{ childrenGap: 5, padding: 10 }}>
						<Text className="stepText">Outcome</Text>
						<TextField
							placeholder="Outcome"
							value={outcomeName}
							onChange={(e, v) => setOutcomeName(v || '')}
						/>
					</Stack>
				</Stack>

				<Stack tokens={{ childrenGap: 5, padding: 10 }}>
					<Text className="stepText">Hypothesis</Text>
					<HypothesisGroup
						onChange={(_, o) => setHypothesis(o?.key as Hypothesis)}
						hypothesis={hypothesis as Hypothesis}
						styles={hypothesisGroupStyles}
					/>
				</Stack>
			</Stack>

			<Stack>
				<Text className="stepText">Chart options</Text>
				<Stack tokens={{ childrenGap: 5, padding: 5 }}>
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
				</Stack>
			</Stack>

			<RawDataPane
				inputData={data}
				outputData={outputData}
				statusMessage={userMessage}
				isCalculatingEstimator={false}
				checkableUnits={checkableUnits}
				onRemoveCheckedUnit={handleRemoveCheckedUnit}
			/>
		</Container>
	)
})
