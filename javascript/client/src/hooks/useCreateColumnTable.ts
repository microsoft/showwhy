/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile } from '@data-wrangling-components/utilities'
import type { Handler, Handler1 } from '@showwhy/types'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import type { ProjectFile } from '~types'
import { percentage, readFile } from '~utils'

export function useCreateColumnTable(
	onFileLoad: Handler1<ProjectFile>,
	onLoadStart?: Handler,
	onProgress?: Handler1<number>,
): (files: BaseFile[], delimiter?: string) => void {
	const onFinishReading = useCallback(
		(table: ColumnTable, name: string) => {
			const _table = table.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			)
			onFileLoad({
				table: _table,
				name: name,
			})
		},
		[onFileLoad],
	)

	const progressPercentage = useCallback(
		(processed: number, total: number) => {
			const filePercentage = Math.round(percentage(processed, total))
			onProgress && onProgress(filePercentage)
		},
		[onProgress],
	)

	return useCallback(
		(files: BaseFile[], delimiter?: string) => {
			onLoadStart && onLoadStart()
			files.forEach(async (file: BaseFile) => {
				const table = await readFile(file, delimiter, progressPercentage)
				const name = file.name
				onFinishReading(table, name)
			})
		},
		[onLoadStart, onFinishReading, progressPercentage],
	)
}
