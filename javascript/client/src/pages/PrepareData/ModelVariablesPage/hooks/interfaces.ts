/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	Setter,
	Maybe,
	CausalFactor,
	VariableDefinition,
	Element,
} from '@showwhy/types'
import type { FactorsOrDefinitions } from './types'
import type { DataTable, TableColumn, ColumnRelation } from '~types'

export interface SelectedArgs {
	defineQuestionData: Element
	definitionOptions: FactorsOrDefinitions
	selectedDefinition: string
	type: string
	causalFactors: CausalFactor[]
}

export interface SubjectIdentifierArgs {
	allTableColumns: Partial<TableColumn[][]>
	relationType: ColumnRelation
	modelVariables: VariableDefinition[][]
}

export interface SubjectIdentifierDataArgs {
	allOriginalTables: DataTable[]
	subjectIdentifier: string[]
	setTableIdentifier: Setter<Maybe<DataTable>>
}
