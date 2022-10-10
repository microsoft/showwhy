/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { isEmpty, sortBy, unzip } from 'lodash'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useRecoilState } from 'recoil'

import {
	AggregateEnabledState,
	AggTreatmentState,
	FilterState,
	RawDataState,
} from '../state/state.js'
import type {
	ColumnMapping,
	DataPoint,
	DateFilter,
	ProcessedInputData,
	Treatment,
} from '../types'
import type { Record } from '../utils/csv'

export const EMPTY_PROCESSED_DATA = {
	dataPoints: [],
	treatedUnitDataPoints: [],
	uniqueUnits: [],
	uniqueDates: [],
	endDate: 0,
	startDate: 0,
	isBalancedPanelData: false,
	nonBalancedUnits: [],
}

const checkTreated = (value: string) => {
	return value === '1' || value.toLocaleLowerCase() === 'true' ? 1 : 0
}

const buildData = (rawData: Record[], columnMapping: ColumnMapping) => {
	if (!columnMapping.unit || !columnMapping.date) return []

	const dataPoints = rawData.map(d => {
		// TODO: do smarter type conversion or cleanup for unit, date, value and treated column values
		const unitName = d[columnMapping.unit]
		const dp: DataPoint = {
			unit: unitName.startsWith('"') ? unitName.slice(1, -1) : unitName,
			date: +d[columnMapping.date],
			value: columnMapping.value ? +d[columnMapping.value] : 0,
		}
		if (columnMapping.treated) {
			// Add default treated value
			dp.treated = checkTreated(d[columnMapping.treated])
		}
		return dp
	})
	const sorted = sortBy(dataPoints, 'date')
	return sorted
}

const updateTreatedPoints = (
	data: DataPoint[],
	treatment: Treatment | null,
) => {
	if (treatment === null) return data
	const unitDateMap = buildTreatedUnitMap(treatment)
	const result: DataPoint[] = []
	data.forEach(d => {
		const dp = { ...d }
		dp.treated = 0
		if (unitDateMap[d.unit]) {
			dp.treated = dp.date < unitDateMap[d.unit] ? 0 : 1
		}
		result.push(dp)
	})
	return result
}

const processDataPoints = (
	dataPoints: DataPoint[],
	filter: DateFilter | null,
): ProcessedInputData => {
	const dp = filter
		? dataPoints.filter(d => {
				return d.date >= filter.startDate && d.date <= filter.endDate
		  })
		: dataPoints

	if (dp.length === 0) return { ...EMPTY_PROCESSED_DATA }

	let startDate = Number.MAX_VALUE
	let endDate = Number.MIN_VALUE
	const unitsSet = new Set<string>()
	const datesSet = new Set<number>()
	dp.forEach(d => {
		unitsSet.add(d.unit)
		datesSet.add(d.date)
		if (d.date < startDate) startDate = d.date
		if (d.date > endDate) endDate = d.date
	})

	const uniqueDates = Array.from(datesSet)

	// invalid dates
	if (startDate === Number.MAX_VALUE && endDate === Number.MIN_VALUE) {
		return { ...EMPTY_PROCESSED_DATA }
	}
	// check if data is a balanced panel data format
	const numTimePeriods = endDate - startDate + 1
	const nonBalancedUnits = getNonBalancedUnits(dp, numTimePeriods)
	const balancedNumRecords = dp.filter(
		d => !nonBalancedUnits.includes(d.unit),
	).length
	const uniqueUnits = Array.from(unitsSet).filter(
		u => !nonBalancedUnits.includes(u),
	)
	const numUnits = uniqueUnits.length
	// data is balanced panel format if we have NxT records
	//  i.e., each unit has observations for all time periods
	const idealYSize = numUnits * numTimePeriods
	const isBalanced = idealYSize === balancedNumRecords

	const result = {
		dataPoints: dp,
		uniqueUnits,
		uniqueDates,
		startDate,
		endDate,
		isBalancedPanelData: isBalanced,
		nonBalancedUnits,
	}

	return result
}

const getDefaultTreatment = (dp: DataPoint[]): Treatment | null => {
	const treatedUnitDataPoints = dp.filter(d => d.treated)
	if (treatedUnitDataPoints.length === 0) return null

	// data point records may not be sorted and thus processing the first record of a treated unit
	//  may be pointing to a time period that is not reflective of the first treatment date
	const treatedUnitDataPointsSorted = sortBy(treatedUnitDataPoints, 'date')

	const unitsSet: Set<string> = new Set()
	const units: string[] = []
	const startDates: number[] = []
	const groups: { [name: string]: string[] } = {}
	treatedUnitDataPointsSorted.forEach(dataPoint => {
		if (!unitsSet.has(dataPoint.unit)) {
			units.push(dataPoint.unit)
			startDates.push(dataPoint.date)
			unitsSet.add(dataPoint.unit)
			if (dataPoint.groupUnits) groups[dataPoint.unit] = dataPoint.groupUnits
		}
	})
	return {
		units,
		startDates,
		groups,
	}
}

const buildTreatedUnitMap = (treatment: Treatment) => {
	const map: { [unit: string]: number } = {} // track all treated units' names per start date
	treatment.units.forEach((units, index) => {
		map[units] = treatment.startDates[index]
	})
	return map
}

const groupTreatedUnits = (
	dataPoints: DataPoint[],
	treatment: Treatment | null,
) => {
	if (treatment === null) return dataPoints
	// Assume that dataPoints is sorted by date in ascending order
	const treatedUnitSet = new Set<string>()
	const treatedUnitsByTreatmentDate: { [date: string]: string[] } = {} // track all treated units' names per start date

	// Initialize treatedUnitSet and treatedUnitsByTreatmentDate map from treatment data
	treatment.units.forEach((unit, index) => {
		const date = treatment.startDates[index]
		treatedUnitSet.add(unit)
		if (treatedUnitsByTreatmentDate[date] === undefined)
			treatedUnitsByTreatmentDate[date] = []
		treatedUnitsByTreatmentDate[date].push(unit)
	})

	// Find default treatment from data points and update treatedUnitSet and start date map accordingly
	dataPoints.forEach(d => {
		if (d.treated && !treatedUnitSet.has(d.unit)) {
			// Update treated unit set
			treatedUnitSet.add(d.unit)
			// Add start date and unit to the map
			if (treatedUnitsByTreatmentDate[d.date] === undefined)
				treatedUnitsByTreatmentDate[d.date] = []
			treatedUnitsByTreatmentDate[d.date].push(d.unit)
		}
	})

	// Extract treated data points and non treated data points
	const treatedUnitDpMap: { [unit: string]: DataPoint[] } = {}
	const newDataPoints: DataPoint[] = []
	dataPoints.forEach(d => {
		if (treatedUnitSet.has(d.unit)) {
			if (treatedUnitDpMap[d.unit] === undefined) treatedUnitDpMap[d.unit] = []
			treatedUnitDpMap[d.unit].push({ ...d, treated: 0 })
		} else {
			newDataPoints.push({ ...d, treated: 0 })
		}
	})

	// Group all treated datapoints by treatment start date
	Object.entries(treatedUnitsByTreatmentDate).forEach(([tDate, units]) => {
		const treatedGroupName =
			'Group_' + tDate.toString() + '_' + units.length.toString()
		const allRecordsAtDate: number[][] = []
		const baselineUnitDataPoints = treatedUnitDpMap[units[0]]
		units.forEach(unit => {
			const valuesForUnit = treatedUnitDpMap[unit].map(d => d.value)
			allRecordsAtDate.push(valuesForUnit)
		})
		const valuesPerDate = unzip(allRecordsAtDate)
		const values = valuesPerDate.map(item => {
			return item.reduce((a, b) => a + b)
		})

		const treatedGroupDp = values.map((value, idx) => {
			const date = baselineUnitDataPoints[idx].date
			return {
				unit: treatedGroupName,
				groupUnits: units,
				date: date,
				value: value / units.length,
				treated: date < +tDate ? 0 : 1,
			} as DataPoint
		})

		newDataPoints.push(...treatedGroupDp)
	})

	return sortBy(newDataPoints, 'date')
}

export const useProcessedInputData = (columnMapping: ColumnMapping) => {
	const [rawData] = useRecoilState(RawDataState)
	const [filter] = useRecoilState(FilterState)
	// This treatments overwrite the treatments in the raw data
	const [aggTreatment, setAggTreatment] = useRecoilState(AggTreatmentState)
	const [aggregateEnabled] = useRecoilState(AggregateEnabledState)

	const isDataLoaded = !isEmpty(rawData)

	const updateTreatmentsForAggregation = useCallback(
		(treatment: Treatment) => {
			// Ungroup treatment units
			const result = { units: [], startDates: [], groups: {} } as Treatment
			treatment.units.forEach((unit, idx) => {
				const date = treatment.startDates[idx]
				// If grouped units, flatten it
				const groupUnits = treatment.groups[unit]
				if (groupUnits) {
					groupUnits.forEach(u => {
						result.units.push(u)
						result.startDates.push(date)
					})
				} else {
					result.units.push(unit)
					result.startDates.push(date)
				}
			})
			setAggTreatment(result)
		},
		[setAggTreatment],
	)

	const dataPoints = useMemo(() => {
		let dp = updateTreatedPoints(
			buildData(rawData, columnMapping),
			aggTreatment,
		)
		if (aggregateEnabled) dp = groupTreatedUnits(dp, aggTreatment)
		return dp
	}, [columnMapping, rawData, aggregateEnabled, aggTreatment])

	// Treatment derived from data
	const defaultTreatment = useMemo(
		() => getDefaultTreatment(dataPoints),
		[dataPoints],
	)

	const data = useMemo(() => {
		return processDataPoints(dataPoints, filter)
	}, [dataPoints, filter])

	const globalDateRange = useMemo(
		() =>
			dataPoints.length > 0
				? {
						startDate: +dataPoints[0].date,
						endDate: +dataPoints[dataPoints.length - 1].date,
				  }
				: { startDate: 0, endDate: 0 },
		[dataPoints],
	)

	const isInitialRender = useRef(true)
	useEffect(() => {
		if (!isInitialRender.current) {
			// Reset treatment to null if column mapping has changed so that it reads default treatment info from the raw data
			setAggTreatment(null)
		}
		isInitialRender.current = false
	}, [columnMapping.treated])

	return useMemo(
		() => ({
			data,
			globalDateRange,
			defaultTreatment,
			updateTreatmentsForAggregation,
			isDataLoaded,
		}),
		[
			data,
			globalDateRange,
			defaultTreatment,
			updateTreatmentsForAggregation,
			isDataLoaded,
		],
	)
}

function getNonBalancedUnits(
	dp: DataPoint[],
	numTimePeriods: number,
): string[] {
	const units = dp.reduce((acc: { [key: string]: number }, curr: DataPoint) => {
		if (!acc[curr.unit]) {
			acc[curr.unit] = 0
		}
		acc[curr.unit] += 1
		return acc
	}, {})
	const nonBalancedUnits: string[] = Object.keys(units).reduce(
		(acc: string[], curr: string) => {
			// eslint-disable-next-line
			if ((units as any)[curr] < numTimePeriods) {
				acc.push(curr)
			}
			return acc
		},
		[],
	)
	return nonBalancedUnits
}
