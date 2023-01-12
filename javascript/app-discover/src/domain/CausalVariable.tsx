/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { TableContainer } from '@datashaper/tables'
import { table as createTable } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import {
	columnCountValid,
	columnMax,
	columnMean,
	columnMin,
	columnMode,
} from '../utils/Math.js'
import type { ColumnNature } from './VariableNature.js'
import { inferColumnNature, VariableNature } from './VariableNature.js'

export interface VariableReference {
	columnName: string
}

export interface CausalVariable extends VariableReference {
	name: string
	nature?: VariableNature
	columnDataNature?: ColumnNature
	derivedFrom?: string[]
	disallowedRelationships?: string[]
	mapping?: Map<string | number | boolean, string>
	tags?: string[]
	description?: string
	max?: number
	min?: number
	magnitude?: number
	mean?: number
	mode?: number
	count?: number
}

export type ForeignTableMapping = {
	resource: string
	fields: string
}

export function applyMappingFromVariableToTable(
	variable: CausalVariable,
	table: ColumnTable,
	doSelect = true,
): ColumnTable {
	if (variable.mapping === undefined || variable.mapping.size === 0) {
		return table
	}

	const recodingOpObj: { [key: string]: string } = {}
	recodingOpObj[
		variable.columnName
	] = `(d, $) => op.recode(d['${variable.columnName}'], $.map, '?')`
	const selectedTable = doSelect ? table.select(variable.columnName) : table

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
	return selectedTable.params({ map: variable.mapping }).derive(recodingOpObj)
}

export function isSame(
	var1: VariableReference,
	var2: VariableReference,
): boolean {
	return var1.columnName === var2.columnName
}

export function arrayIncludesVariable(
	array: Array<VariableReference>,
	variable: VariableReference,
) {
	return array.some(inModelVariable => isSame(variable, inModelVariable))
}

export function inferMissingMetadataForTable(
	table: TableContainer | undefined,
	existingMetadata?: CausalVariable[],
) {
	const metadata: CausalVariable[] = []
	table?.table?.columnNames().forEach(columnName => {
		const existingMetadatum = existingMetadata?.find(
			metadatum => metadatum.columnName === columnName,
		)
		const completedMetadatum = inferMissingMetadataForColumn(
			table,
			columnName,
			existingMetadatum,
		)
		if (completedMetadatum != null) {
			metadata.push(completedMetadatum)
		}
	})
	return metadata
}

export function inferMissingMetadataForColumn(
	container: TableContainer | undefined,
	columnName: string,
	current?: CausalVariable,
) {
	const table = container?.table
	if (table == null) {
		return current
	}
	const name = current?.name ?? columnName
	const min = current?.min ?? columnMin(table, columnName)
	const max = current?.max ?? columnMax(table, columnName)
	const mean = current?.mean ?? columnMean(table, columnName)
	const mode = current?.mode ?? columnMode(table, columnName)
	const count = current?.count ?? columnCountValid(table, columnName)
	const magnitude = current?.magnitude ?? Math.max(Math.abs(max), Math.abs(min))
	let columnDataNature = current?.columnDataNature
	let mapping = current?.mapping
	let nature = current?.nature

	if (nature == null) {
		columnDataNature = inferColumnNature(table, columnName)

		//
		// TODO: determine why setting the 'nature' field causes hanging
		//
		// nature = columnDataNature.mostLikelyNature
		if (
			mapping === undefined &&
			columnDataNature.mostLikelyNature === VariableNature.CategoricalNominal
		) {
			const uniquePresentValues = columnDataNature.uniquePresentValues ?? []
			mapping = new Map(
				uniquePresentValues.map(v => [
					v,
					`${columnName} : ${v.toString().replaceAll("'", '')}`,
				]),
			)
		}
		columnDataNature = {
			...columnDataNature,
			uniquePresentValues: undefined,
			uniqueValues: undefined,
		}
	}

	return {
		...current,
		name,
		nature,
		max,
		min,
		magnitude,
		mean,
		mode,
		count,
		mapping,
		columnDataNature,
		columnName,
	}
}

export function createVariablesFromTable(
	datasetKey: string,
	table: ColumnTable | undefined,
	metadata: CausalVariable[],
) {
	table = table ?? createTable({})
	const variables = new Map()
	const inferredMetadata = inferMissingMetadataForTable(table, metadata)

	for (const colName of table?.columnNames() ?? []) {
		const meta = metadata?.find(md => md.columnName === colName)
		const inferredMeta = inferredMetadata.find(md => md.columnName === colName)

		variables.set(colName, {
			...inferredMeta,
			...meta,
			datasetName: datasetKey,
			key: `${datasetKey} : ${colName}`,
		})
	}
	return variables
}

export function isDerived(variable: CausalVariable): boolean {
	return variable?.derivedFrom !== undefined && variable.derivedFrom.length > 0
}

export function isAddable(variable: CausalVariable): boolean {
	return !(variable.nature === VariableNature.Excluded || variable.count === 0)
}
