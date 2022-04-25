/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { BaseFile } from '@data-wrangling-components/utilities'
import { guessDelimiter } from '@data-wrangling-components/utilities'
import type { Handler, Handler1 } from '@showwhy/types'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import type { ProjectFile } from '~types'
import { percentage, readFile } from '~utils'

export function useCreateColumnTable(
	onFileLoad: Handler1<ProjectFile>,
	onLoadStart: Handler,
	onProgress: Handler1<number>,
): (files: BaseFile[], delimiter?: string) => void {
	const onFinishReading = useCallback(
		(table: ColumnTable, name: string, delimiter: string) => {
			const _table = table.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			)
			onFileLoad({
				table: _table,
				name: name,
				delimiter,
			})
		},
		[onFileLoad],
	)

	return useCallback(
		(files: BaseFile[], delimiter?: string, autoType = false) => {
			onLoadStart && onLoadStart()
			files.forEach(async (file: BaseFile) => {
				const handleProgressPercentage = (processed: number, total: number) => {
					if (onProgress) {
						const filePercentage = Math.round(percentage(processed, total))
						onProgress(filePercentage)
					}
				}
				const _delimiter = delimiter || guessDelimiter(file.name)
				const table = await readFile(
					file,
					_delimiter,
					autoType,
					handleProgressPercentage,
				)
				const name = file.name
				onFinishReading(table, name, _delimiter)
			})
		},
		[onLoadStart, onFinishReading, onProgress],
	)
}
