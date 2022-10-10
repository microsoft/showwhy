/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-argument */
import type { DataTable } from '@datashaper/workflow'
import { useCallback } from 'react'

export function useContent(table: DataTable): string {
	const workflow = table?.workflow?.toSchema()
	if (!workflow) {
		return ''
	} else {
		return JSON.stringify(workflow, null, 2)
	}
}

export function useOnChange(
	table: DataTable,
): (value: string | undefined) => void {
	return useCallback(
		(value: string | undefined) => {
			table.workflow.loadSchema(value == null ? undefined : JSON.parse(value))
		},
		[table],
	)
}
