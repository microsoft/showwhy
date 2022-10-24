/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { TableContainer } from '@datashaper/tables'
import type { DataTable, Maybe } from '@datashaper/workflow'
import type ColumnTable from 'arquero/dist/types/table/column-table.js'
import { useObservableState } from 'observable-hooks'
import { from } from 'rxjs'

/**
 * Uses the latest table from a data package. This is updatde as the package changes
 * @param pkg - The data package to load the table from
 * @returns The latest table
 */
export function useDataTableOutput(
	pkg: DataTable | undefined,
): Maybe<TableContainer> {
	return useObservableState(pkg?.output$ ?? none())
}

/**
 * Use the raw source table from a data package without any workflow applied to it.
 * @param pkg - The data package to load the datasource from
 * @returns
 */
export function useDataTableSource(
	pkg: DataTable | undefined,
): Maybe<ColumnTable> {
	return useObservableState(pkg?.source$ ?? none(), () => pkg?.source)
}

const none = () => from([undefined])
