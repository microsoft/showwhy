/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices } from '@datashaper/app-framework'
import { RecoilBasedProfileHost } from '@datashaper/app-framework'
import { memo } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'

import { App } from '../App/App.js'
import {
	AggregateEnabledState,
	AggTreatmentState,
	ChartOptionsState,
	CheckedUnitsState,
	ColumnMappingState,
	EstimatorState,
	EventNameState,
	FileNameState,
	FilterState,
	HypothesisState,
	OutcomeNameState,
	OutputResState,
	PlaceboOutputResState,
	PlaceboSimulationState,
	RawDataState,
	SelectedTabKeyState,
	TimeAlignmentState,
	TreatedUnitsState,
	TreatmentStartDatesAfterEstimateState,
	TreatmentStartDatesState,
	UnitsState,
} from '../state/index.js'
import type { EventAnalysisResource } from './EventAnalysisResource.js'

export const EventsAppRoot: React.FC<{
	resource: EventAnalysisResource
	api: AppServices
}> = memo(function EventsAppRoot({ resource, api }) {
	return (
		<RecoilBasedProfileHost
			resource={resource}
			loadState={loadState}
			saveState={saveState}
		>
			<App api={api} />
		</RecoilBasedProfileHost>
	)
})

function loadState(resource: EventAnalysisResource, { set }: MutableSnapshot) {
	set(RawDataState, resource.rawData)
	set(ColumnMappingState, resource.columnMapping)
	set(OutcomeNameState, resource.outcomeName)
	set(EventNameState, resource.eventName)
	set(FileNameState, resource.fileName)
	set(EstimatorState, resource.estimator)
	set(TreatedUnitsState, resource.treatedUnits)
	set(TreatmentStartDatesState, resource.treatmentStartDates)
	set(CheckedUnitsState, new Set(resource.checkedUnits))
	set(ChartOptionsState, resource.chartOptions)
	set(FilterState, resource.filter)
	set(OutputResState, resource.outputRes)
	set(PlaceboOutputResState, resource.placeboOutputRes)
	set(PlaceboSimulationState, resource.placeboSimulation)
	set(SelectedTabKeyState, resource.selectedTabKey)
	set(TimeAlignmentState, resource.timeAlignment)
	set(AggTreatmentState, resource.aggTreatment)
	set(AggregateEnabledState, resource.aggregateEnabled)
	set(HypothesisState, resource.hypothesis)
	set(UnitsState, resource.units)
	set(
		TreatmentStartDatesAfterEstimateState,
		resource.treatmentStartDatesAfterEstimate,
	)
}

function saveState(resource: EventAnalysisResource, snap: Snapshot) {
	resource.rawData = snap.getLoadable(RawDataState).getValue()
	resource.columnMapping = snap.getLoadable(ColumnMappingState).getValue()
	resource.outcomeName = snap.getLoadable(OutcomeNameState).getValue()
	resource.eventName = snap.getLoadable(EventNameState).getValue()
	resource.fileName = snap.getLoadable(FileNameState).getValue()
	resource.estimator = snap.getLoadable(EstimatorState).getValue()
	resource.treatedUnits = snap.getLoadable(TreatedUnitsState).getValue()
	resource.treatmentStartDates = snap
		.getLoadable(TreatmentStartDatesState)
		.getValue()

	const checkedUnits = snap.getLoadable(CheckedUnitsState).getValue()
	resource.checkedUnits = checkedUnits ? [...checkedUnits.keys()] : null
	resource.chartOptions = snap.getLoadable(ChartOptionsState).getValue()
	resource.filter = snap.getLoadable(FilterState).getValue()
	resource.outputRes = snap.getLoadable(OutputResState).getValue()
	resource.placeboOutputRes = snap.getLoadable(PlaceboOutputResState).getValue()

	resource.placeboSimulation = snap
		.getLoadable(PlaceboSimulationState)
		.getValue()
	resource.selectedTabKey = snap.getLoadable(SelectedTabKeyState).getValue()
	resource.timeAlignment = snap.getLoadable(TimeAlignmentState).getValue()
	resource.aggTreatment = snap.getLoadable(AggTreatmentState).getValue()
	resource.aggregateEnabled = snap.getLoadable(AggregateEnabledState).getValue()
	resource.hypothesis = snap.getLoadable(HypothesisState).getValue()
	resource.units = snap.getLoadable(UnitsState).getValue()
	resource.treatmentStartDatesAfterEstimate = snap
		.getLoadable(TreatmentStartDatesAfterEstimateState)
		.getValue()
}
