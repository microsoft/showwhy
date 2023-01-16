/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Resource } from '@datashaper/workflow'
import { Hypothesis } from '@showwhy/app-common'

import { DEFAULT_CHART_OPTIONS } from '../state/index.js'
import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
	Treatment,
} from '../types.js'
import { CONFIGURATION_TABS, TimeAlignmentOptions } from '../types.js'
import type { Record as DataRecord } from '../utils/csv.js'
import { EVENTS_PROFILE } from './constants.js'
import type { EventAnalysisResourceSchema } from './EventAnalysisResourceSchema.js'

export class EventAnalysisResource extends Resource {
	public readonly $schema = ''
	public readonly profile = EVENTS_PROFILE

	public defaultTitle(): string {
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

	public override toSchema(): EventAnalysisResourceSchema {
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

	public override loadSchema(schema: EventAnalysisResourceSchema) {
		super.loadSchema(schema)
		this.name = schema?.name ?? this.defaultName()
		this.rawData = schema.rawData
		this.columnMapping = schema.columnMapping
		this.outcomeName = schema.outcomeName
		this.eventName = schema.eventName
		this.fileName = schema.fileName
		this.estimator = schema.estimator
		this.treatedUnits = schema.treatedUnits
		this.treatmentStartDates = schema.treatmentStartDates
		this.checkedUnits = schema.checkedUnits
		this.chartOptions = schema.chartOptions
		this.filter = schema.filter
		this.outputRes = schema.outputRes
		this.placeboOutputRes = schema.placeboOutputRes
		this.placeboSimulation = schema.placeboSimulation
		this.selectedTabKey = schema.selectedTabKey
		this.timeAlignment = schema.timeAlignment
		this.aggTreatment = schema.aggTreatment
		this.aggregateEnabled = schema.aggregateEnabled
		this.hypothesis = schema.hypothesis
		this.units = schema.units
		this.treatmentStartDatesAfterEstimate =
			schema.treatmentStartDatesAfterEstimate
	}
}
