/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FactorsOrDefinitions } from './types'
import {
	DataTable,
	CausalFactor,
	VariableDefinition,
	Element,
	TableColumn,
	Setter,
	ColumnRelation,
	Maybe,
} from '~types'

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
