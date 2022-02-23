/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { Handler1 } from '../primitives'

export interface TransformTable {
	outputViewTable?: ColumnTable
	outputTable?: ColumnTable
	handleTransformRequested: (step: any, index?: number) => Promise<void>
	onDeleteStep: Handler1<number>
	actualSteps: Step[]
	onDuplicateDefinition: (definitionId: string, newDefinition: string) => void
	onDuplicateStep: (column: string) => void
}
