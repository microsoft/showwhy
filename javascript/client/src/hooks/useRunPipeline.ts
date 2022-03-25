/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from '@data-wrangling-components/core'
import { usePipeline, useStore } from '@data-wrangling-components/react'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import type { ProjectFile } from '../types'

export function useRunPipeline(): (file: ProjectFile) => Promise<ProjectFile> {
	const store = useStore()
	const pipeline = usePipeline(store)

	return useCallback(
		async (file: ProjectFile) => {
			const { stepPostLoad } = file
			delete file.stepPostLoad
			store.set({
				id: file.name,
				table: file.table,
				name: file.name,
			})
			pipeline.addAll(stepPostLoad as Step[])
			const result = await pipeline.run()
			const resultTable = result?.table?.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			) as ColumnTable
			const f: ProjectFile = {
				...file,
				content: resultTable.toCSV(),
				name: file.name,
				id: file.name,
				table: resultTable,
				autoType: !!file.autoType,
			}
			return f
		},
		[store, pipeline],
	)
}
