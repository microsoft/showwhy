/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableStore } from '@data-wrangling-components/core'
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

export type CausalVariable = VariableReference & {
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
	foreignkey?: ForeignTableMapping
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
	table: ColumnTable,
	existingMetadata?: CausalVariable[],
) {
	const metadata: CausalVariable[] = []
	table?.columnNames().forEach(columnName => {
		const existingMetadatum = existingMetadata?.find(
			metadatum => metadatum.columnName === columnName,
		)
		const completedMetadatum = inferMissingMetadataForColumn(
			table,
			columnName,
			existingMetadatum,
		)
		metadata.push(completedMetadatum)
	})
	return metadata
}

export function inferMissingMetadataForColumn(
	table: ColumnTable,
	columnName: string,
	existingMetadatum?: CausalVariable,
) {
	const name =
		existingMetadatum?.name === undefined ? columnName : existingMetadatum.name
	const min =
		existingMetadatum?.min === undefined
			? columnMin(table, columnName)
			: existingMetadatum.min
	const max =
		existingMetadatum?.max === undefined
			? columnMax(table, columnName)
			: existingMetadatum.max
	const mean =
		existingMetadatum?.mean === undefined
			? columnMean(table, columnName)
			: existingMetadatum.mean
	const mode =
		existingMetadatum?.mode === undefined
			? columnMode(table, columnName)
			: existingMetadatum.mode
	const count =
		existingMetadatum?.count === undefined
			? columnCountValid(table, columnName)
			: existingMetadatum.count
	const magnitude =
		existingMetadatum?.magnitude === undefined
			? Math.max(Math.abs(max), Math.abs(min))
			: existingMetadatum.magnitude

	let mapping = existingMetadatum?.mapping
	let columnDataNature: ColumnNature | undefined =
		existingMetadatum?.columnDataNature
	if (columnDataNature === undefined) {
		const inferredColumnDataNature: ColumnNature = inferColumnNature(
			table,
			columnName,
		)
		if (
			mapping === undefined &&
			inferredColumnDataNature.mostLikelyNature ===
				VariableNature.CategoricalNominal
		) {
			const uniquePresentValues =
				inferredColumnDataNature.uniquePresentValues || []
			mapping = new Map(
				uniquePresentValues.map(v => [
					v,
					`${columnName} : ${v.toString().replaceAll("'", '')}`,
				]),
			)
		}

		columnDataNature = inferredColumnDataNature
		delete columnDataNature.uniqueValues
		delete columnDataNature.uniquePresentValues
	}

	const nature =
		existingMetadatum?.nature === undefined
			? columnDataNature.mostLikelyNature
			: existingMetadatum.nature
	return {
		...existingMetadatum,
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

export async function createVariablesFromTable(
	datasetKey: string,
	tableStore: TableStore,
	metadata: CausalVariable[],
) {
	const variables = new Map()
	const tableContainer = await tableStore.get(datasetKey)
	const table = tableContainer.table ?? createTable({})
	const inferredMetadata = inferMissingMetadataForTable(table, metadata)

	for (const columnName of table?.columnNames() ?? []) {
		let meta = metadata?.find(metadatum => metadatum.columnName === columnName)
		const inferredMeta = inferredMetadata.find(
			metadatum => metadatum.columnName === columnName,
		)
		if (meta?.foreignkey) {
			const mapping = await createMapFromForeignKey(meta.foreignkey, tableStore)
			meta = { ...meta, mapping }
		}

		variables.set(columnName, {
			...inferredMeta,
			...meta,
			datasetName: datasetKey,
			key: `${datasetKey} : ${columnName}`,
		})
	}
	return variables
}

export async function createMapFromForeignKey(
	foreignTableMapping: ForeignTableMapping,
	tableStore: TableStore,
) {
	const foreignTableContainer = await tableStore.get(
		foreignTableMapping.resource,
	)
	const foreignTable = foreignTableContainer.table ?? createTable({})
	const mapping = new Map()
	/* eslint-disable-next-line */
	foreignTable.objects().forEach((row: any) => mapping.set(row.key, row.value))
	return mapping
}

export function isDerived(variable: CausalVariable): boolean {
	return variable?.derivedFrom !== undefined && variable.derivedFrom.length > 0
}

export function isAddable(variable: CausalVariable): boolean {
	return !(variable.nature === VariableNature.Excluded || variable.count === 0)
}
