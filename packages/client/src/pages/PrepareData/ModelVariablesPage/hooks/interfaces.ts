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
} from '~types'

export interface SelectedArgs {
	defineQuestionData: Element
	definitionOptions: FactorsOrDefinitions
	selectedDefinition: string
	pageType: string
	causalFactors: CausalFactor[]
}

export interface SubjectIdentifierArgs {
	allTableColumns: Partial<TableColumn[][]>
	modelVariables: VariableDefinition[][]
}

export interface SubjectIdentifierDataArgs {
	allOriginalTables: DataTable[]
	subjectIdentifier: string[]
	setTableIdentifier: Setter<DataTable | undefined>
}
