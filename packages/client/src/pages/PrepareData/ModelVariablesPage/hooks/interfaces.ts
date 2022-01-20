/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FactorsOrDefinitions } from './types'
import { ColumnRelation } from '~enums'
import {
	BasicTable,
	CausalFactor,
	VariableDefinition,
	Element,
	TableColumn,
} from '~interfaces'
import { Setter } from '~types'

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
	allOriginalTables: BasicTable[]
	subjectIdentifier: string[]
	setTableIdentifier: Setter<BasicTable | undefined>
}
