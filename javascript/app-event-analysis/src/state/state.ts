/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Hypothesis } from '@showwhy/app-common'
import { atom } from 'recoil'

import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
	Treatment,
} from '../types.js'
import {
	CONFIGURATION_TABS,
	Estimators,
	TimeAlignmentOptions,
} from '../types.js'
import type { Record } from '../utils/csv'

export const RawDataState = atom<Record[]>({
	key: 'RawDataState',
	default: [],
})

export const ColumnMappingState = atom<ColumnMapping>({
	key: 'ColumnMappingState',
	default: {
		unit: '',
		date: '',
		value: '',
		treated: '',
	},
})

export const OutcomeNameState = atom<string>({
	key: 'OutcomeNameState',
	default: '',
})

export const EventNameState = atom<string>({
	key: 'EventNameState',
	default: 'treatment/event',
})

export const FileNameState = atom<string>({
	key: 'FileNameState',
	default: '',
})

export const EstimatorState = atom<string>({
	key: 'EstimatorState',
	default:
		Object.keys(Estimators)[Object.values(Estimators).indexOf(Estimators.SDID)],
})

export const TreatedUnitsState = atom<string[]>({
	key: 'TreatedUnitState',
	default: [],
})

export const TreatmentStartDatesState = atom<number[]>({
	key: 'TreatmentStartDateState',
	default: [],
})

export const CheckedUnitsState = atom<Set<string> | null>({
	key: 'CheckedUnitsState',
	default: null,
})

export const ChartOptionsState = atom<ChartOptions>({
	key: 'ChartOptionsState',
	default: {
		renderRawData: true,
		showTreatmentStart: true,
		showSynthControl: false,
		applyIntercept: false,
		relativeIntercept: false,
		showGrid: true,
		showMeanTreatmentEffect: false,
		showChartPerUnit: false,
	},
})

export const FilterState = atom<DateFilter | null>({
	key: 'FilterState',
	default: null,
})

export const OutputResState = atom<SDIDOutputResponse | null>({
	key: 'OutputResState',
	default: null,
})

export const PlaceboOutputResState = atom<
	Map<string, SDIDOutputResponse | null>
>({
	key: 'PlaceboOutputResState',
	default: new Map(),
})

export const PlaceboSimulationState = atom<boolean>({
	key: 'PlaceboSimulationState',
	default: false,
})

export const SelectedTabKeyState = atom<string>({
	key: 'SelectedTabKeyState',
	default: CONFIGURATION_TABS.prepareAnalysis.key,
})

export const TimeAlignmentState = atom<string>({
	key: 'TimeAlignmentState',
	default:
		Object.keys(TimeAlignmentOptions)[
			Object.values(TimeAlignmentOptions).indexOf(
				TimeAlignmentOptions.Staggered_Design,
			)
		],
})

export const AggTreatmentState = atom<Treatment | null>({
	key: 'aggTreatmentState',
	default: null,
})

export const AggregateEnabledState = atom<boolean>({
	key: 'aggregateEnabledState',
	default: false,
})

export const TreatmentStartDatesAfterEstimateState = atom<{
	tStartDates: number[]
} | null>({
	key: 'treatmentStartDatesAfterEstimateState',
	default: null,
})

export const HypothesisState = atom<Hypothesis | null>({
	key: 'HypothesisState',
	default: Hypothesis.Change,
})
export const UnitsState = atom<string>({
	key: 'UnitsState',
	default: '',
})
