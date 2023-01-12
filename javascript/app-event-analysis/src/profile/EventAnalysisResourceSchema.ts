/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ResourceSchema } from '@datashaper/schema'
import type { Hypothesis } from '@showwhy/app-common'

import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
	Treatment,
} from '../types.js'
import type { Record as DataRecord } from '../utils/csv.js'
import type { EVENTS_PROFILE } from './constants.js'

export interface EventAnalysisResourceSchema extends ResourceSchema {
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
