/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { Maybe, VariableDefinition } from '~types'
import { Handler1 } from '../primitives'

export interface TransformTable {
	outputViewTable?: ColumnTable
	outputTable?: ColumnTable
	handleTransformRequested: (step: any) => Promise<void>
	onDeleteStep: Handler1<number>
	selectedVariable: Maybe<VariableDefinition>
}
