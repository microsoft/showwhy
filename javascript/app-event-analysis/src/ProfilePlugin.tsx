/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AppServices, ProfilePlugin } from '@datashaper/app-framework'
import {
	CommandBarSection,
	RecoilBasedProfileHost,
} from '@datashaper/app-framework'
import type { ResourceSchema } from '@datashaper/schema'
import type { DataPackage } from '@datashaper/workflow'
import { Resource } from '@datashaper/workflow'
import type { IContextualMenuItem } from '@fluentui/react'
import { Hypothesis } from '@showwhy/app-common'
import { memo } from 'react'
import type { MutableSnapshot, Snapshot } from 'recoil'

import { App } from './components/App.js'
import {
	AggregateEnabledState,
	AggTreatmentState,
	ChartOptionsState,
	CheckedUnitsState,
	ColumnMappingState,
	DEFAULT_CHART_OPTIONS,
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
} from './state/state.js'
import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
	Treatment,
} from './types.js'
import { CONFIGURATION_TABS, TimeAlignmentOptions } from './types.js'
import type { Record as DataRecord } from './utils/csv.js'

const EVENTS_PROFILE = 'showwhy-events'

export class EventAnalysisProfilePlugin
	implements ProfilePlugin<EventAnalysisResource>
{
	public readonly profile = EVENTS_PROFILE
	public readonly title = 'Event Analysis'
	public readonly iconName = 'Event'

	public renderer = EventsAppRoot
	private _dataPackage: DataPackage | undefined

	public initialize(_api: AppServices, dataPackage: DataPackage) {
		this._dataPackage = dataPackage
	}

	public createResource() {
		return new EventAnalysisResource()
	}

	public getCommandBarCommands(
		section: CommandBarSection,
	): IContextualMenuItem[] | undefined {
		const dp = this._dataPackage
		if (dp == null) {
			throw new Error('Data package not initialized')
		}
		if (section === CommandBarSection.New) {
			return [
				{
					key: this.profile,
					text: `New ${this.title}`,
					onClick: () => {
						const resource = this.createResource?.()
						resource.name = dp.suggestResourceName(resource.name)
						dp.addResource(resource)
					},
				},
			]
		}
	}
}

interface EventAnalysisSchema extends ResourceSchema {
	profile: typeof EVENTS_PROFILE

	rawData: DataRecord[]
	columnMapping: ColumnMapping
	outcomeName: string
	eventName: string
	fileName: string
	estimator: string
	treatedUnits: string[]
	treatmentStartDates: number[]
	checkedUnits: string[] | null
	chartOptions: ChartOptions
	filter: DateFilter | null
	outputRes: SDIDOutputResponse | null
	placeboOutputRes: Record<string, SDIDOutputResponse | null>
	placeboSimulation: boolean
	selectedTabKey: string
	timeAlignment: string
	aggTreatment: Treatment | null
	aggregateEnabled: boolean
	hypothesis: Hypothesis | null
	units: string
	treatmentStartDatesAfterEstimate: { tStartDates: number[] } | null
}

class EventAnalysisResource extends Resource {
	public readonly $schema = ''
	public readonly profile = EVENTS_PROFILE

	public defaultName(): string {
		return 'Event Analysis'
	}

	public rawData: DataRecord[] = []
	public columnMapping: ColumnMapping = {}
	public outcomeName = ''
	public eventName = ''
	public fileName = ''
	public estimator = ''
	public treatedUnits: string[] = []
	public treatmentStartDates: number[] = []
	public checkedUnits: string[] | null = null
	public chartOptions: ChartOptions = DEFAULT_CHART_OPTIONS
	public filter: DateFilter | null = null
	public outputRes: SDIDOutputResponse | null = null
	public placeboOutputRes: Record<string, SDIDOutputResponse | null> = {}
	public placeboSimulation = false
	public selectedTabKey: string = CONFIGURATION_TABS.prepareAnalysis.key
	public timeAlignment: string =
		Object.keys(TimeAlignmentOptions)[
			Object.values(TimeAlignmentOptions).indexOf(
				TimeAlignmentOptions.Staggered_Design,
			)
		]
	public aggTreatment: Treatment | null = null
	public aggregateEnabled = false
	public hypothesis: Hypothesis | null = Hypothesis.Change
	public units = ''
	public treatmentStartDatesAfterEstimate: { tStartDates: number[] } | null =
		null

	public override toSchema(): EventAnalysisSchema {
		return {
			...super.toSchema(),
			profile: this.profile,
			rawData: this.rawData,
			columnMapping: this.columnMapping,
			outcomeName: this.outcomeName,
			eventName: this.eventName,
			fileName: this.fileName,
			estimator: this.estimator,
			treatedUnits: this.treatedUnits,
			treatmentStartDates: this.treatmentStartDates,
			checkedUnits: this.checkedUnits,
			chartOptions: this.chartOptions,
			filter: this.filter,
			outputRes: this.outputRes,
			placeboOutputRes: this.placeboOutputRes,
			placeboSimulation: this.placeboSimulation,
			selectedTabKey: this.selectedTabKey,
			timeAlignment: this.timeAlignment,
			aggTreatment: this.aggTreatment,
			aggregateEnabled: this.aggregateEnabled,
			hypothesis: this.hypothesis,
			units: this.units,
			treatmentStartDatesAfterEstimate: this.treatmentStartDatesAfterEstimate,
		}
	}

	public override loadSchema(input: EventAnalysisSchema) {
		super.loadSchema(input)
		this.rawData = input.rawData
		this.columnMapping = input.columnMapping
		this.outcomeName = input.outcomeName
		this.eventName = input.eventName
		this.fileName = input.fileName
		this.estimator = input.estimator
		this.treatedUnits = input.treatedUnits
		this.treatmentStartDates = input.treatmentStartDates
		this.checkedUnits = input.checkedUnits
		this.chartOptions = input.chartOptions
		this.filter = input.filter
		this.outputRes = input.outputRes
		this.placeboOutputRes = input.placeboOutputRes
		this.placeboSimulation = input.placeboSimulation
		this.selectedTabKey = input.selectedTabKey
		this.timeAlignment = input.timeAlignment
		this.aggTreatment = input.aggTreatment
		this.aggregateEnabled = input.aggregateEnabled
		this.hypothesis = input.hypothesis
		this.units = input.units
		this.treatmentStartDatesAfterEstimate =
			input.treatmentStartDatesAfterEstimate
	}
}

const EventsAppRoot: React.FC<{ resource: EventAnalysisResource }> = memo(
	function EventsAppRoot({ resource }) {
		return (
			<RecoilBasedProfileHost
				resource={resource}
				loadState={loadState}
				saveState={saveState}
			>
				<App />
			</RecoilBasedProfileHost>
		)
	},
)

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
	set(PlaceboOutputResState, new Map(Object.entries(resource.placeboOutputRes)))
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
	resource.placeboOutputRes = hashMap(
		snap.getLoadable(PlaceboOutputResState).getValue(),
	)

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

function hashMap<V>(m: Map<string, V>): Record<string, V> {
	const result: Record<string, V> = {}
	m.forEach((v, k) => (result[k] = v))
	return result
}
