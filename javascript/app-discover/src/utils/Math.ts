/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { agg, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

export function clamp(input: number, min: number, max: number): number {
	return input < min ? min : input > max ? max : input
}

// eslint-disable-next-line max-params
export function map(
	current: number,
	inMin: number,
	inMax: number,
	outMin: number,
	outMax: number,
): number {
	const mapped: number =
		((current - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin
	return clamp(mapped, outMin, outMax)
}

export function columnMax(table: ColumnTable, column: string): number {
	return agg(table, op.max(column)) as number
}

export function columnMin(table: ColumnTable, column: string): number {
	return agg(table, op.min(column)) as number
}

export function columnMean(table: ColumnTable, column: string): number {
	return agg(table, op.mean(column)) as number
}

export function columnMode(table: ColumnTable, column: string): number {
	return agg(table, op.mode(column)) as number
}

export function columnCountValid(table: ColumnTable, column: string): number {
	return agg(table, op.valid(column)) as number
}

export interface ColumnStats {
	min: number
	max: number
	mean: number
	mode: number
	count: number
}

export function columnStats(table: ColumnTable, column: string): ColumnStats {
	const stats = agg(
		table,
		`d => [op.min('${column}'), op.max('${column}'), op.mean('${column}'), op.mode('${column}'), op.valid('${column}')]`,
	) as number[]
	return {
		min: stats[0],
		max: stats[1],
		mean: stats[2],
		mode: stats[3],
		count: stats[4],
	}
}

export function allColumnStats(table: ColumnTable): Map<string, ColumnStats> {
	const columnQueries = table
		.columnNames()
		.map(
			column =>
				`[op.min('${column}'), op.max('${column}'), op.mean('${column}'), op.mode('${column}'), op.valid('${column}')],`,
		)
	const allColumnQueryStrings = ''.concat(...columnQueries)
	const queryString = `d => [${allColumnQueryStrings}]`
	const allStats = agg(table, queryString) as number[][]
	const mappedStats = new Map<string, ColumnStats>()
	allStats.forEach((stats: number[], i: number) => {
		const columnName = table.columnNames()[i]
		const statObj = {
			min: stats[0],
			max: stats[1],
			mean: stats[2],
			mode: stats[3],
			count: stats[4],
		}
		mappedStats.set(columnName, statObj)
	})

	return mappedStats
}
