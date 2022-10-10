/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	ChartOptions,
	ColumnMapping,
	DateFilter,
	SDIDOutputResponse,
} from '../types.js'
import type { Record } from './csv.js'
import { csvToRecords, recordsToCsv } from './csv.js'
import { parseJSON } from './json.js'

type ExportState = {
	rawData: Record[]
	eventName: string
	outcomeName: string
	columnMapping: ColumnMapping
	filter: DateFilter | null
	treatmentStartDates: number[]
	treatedUnits: string[]
	checkedUnits: Set<string> | null
	chartOptions: ChartOptions
	estimator: string
	timeAlignment: string
	outputData: SDIDOutputResponse | null
	aggregateEnabled: boolean
}

export const deserializeExportState = (
	payload: string,
): ExportState | undefined => {
	const data:
		| {
				rawData: string
				eventName: string
				outcomeName: string
				columnMapping: ColumnMapping
				filter: DateFilter | null
				treatmentStartDates: number[]
				treatedUnits: string[]
				checkedUnits: string[] | null
				chartOptions: ChartOptions
				estimator: string
				timeAlignment: string
				outputData: SDIDOutputResponse
				aggregateEnabled: boolean
		  }
		| undefined = parseJSON(payload)
	if (!data) return
	const {
		rawData,
		eventName,
		outcomeName,
		columnMapping,
		filter,
		treatmentStartDates,
		treatedUnits,
		checkedUnits,
		chartOptions,
		estimator,
		timeAlignment,
		outputData,
		aggregateEnabled,
	} = data
	return {
		rawData: csvToRecords(rawData),
		eventName,
		outcomeName,
		columnMapping,
		filter,
		treatmentStartDates,
		treatedUnits,
		checkedUnits: new Set(checkedUnits),
		chartOptions,
		estimator,
		timeAlignment,
		outputData,
		aggregateEnabled,
	}
}

export const serializeExportState = (payload: ExportState) => {
	const {
		rawData,
		eventName,
		outcomeName,
		columnMapping,
		filter,
		treatmentStartDates,
		treatedUnits,
		checkedUnits,
		chartOptions,
		estimator,
		timeAlignment,
		outputData,
		aggregateEnabled,
	} = payload

	const csvData = recordsToCsv(rawData)
	const exportData = {
		rawData: csvData,
		eventName,
		outcomeName,
		columnMapping,
		filter,
		treatmentStartDates,
		treatedUnits,
		checkedUnits: (checkedUnits && Array.from(checkedUnits)) || null,
		chartOptions,
		estimator,
		timeAlignment,
		outputData,
		aggregateEnabled,
	}
	return JSON.stringify(exportData)
}
