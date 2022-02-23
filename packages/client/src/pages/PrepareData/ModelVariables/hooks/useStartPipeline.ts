/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Pipeline, Step } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

export function useStartPipeline(
	pipeline: Pipeline,
	actualSteps: Step[],
	outputTable?: ColumnTable,
): () => void {
	return useCallback(() => {
		if (!pipeline.store.list().length && outputTable) {
			pipeline.store.set('output', outputTable)
		}
		if (!pipeline.steps.length && actualSteps) {
			pipeline.addAll(actualSteps)
		}
	}, [pipeline, outputTable, actualSteps])
}
