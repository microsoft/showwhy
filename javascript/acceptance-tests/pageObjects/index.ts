/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from '@playwright/test'

import { Header } from './Header'
import { DefineCausalQuestionPO } from './DefineCausalQuestionPO'
import { ConsiderAlternativeDefinitionsPO } from './ConsiderAlternativeDefinitionsPO'
import { ConsiderRelevantVariablesPO } from './ConsiderRelevantVariablesPO'
import { ConsiderVariableRelationshipsPO } from './ConsiderVariableRelationshipsPO'
import { LoadDataTablesPO } from './LoadDataTablesPO'
import { SelectCausalEstimatorsPO } from './SelectCausalEstimatorsPO'
import { EstimateCausalEffectPO } from './EstimateCausalEffectPO'
import { EvaluateHypothesisPO } from './EvaluateHypothesisPO'

export interface PageObjects {
	header: Header
	defineCausalQuestion: DefineCausalQuestionPO
	considerAlternativeDefinitions: ConsiderAlternativeDefinitionsPO
	considerRelevantVariables: ConsiderRelevantVariablesPO
	considerVariableRelationships: ConsiderVariableRelationshipsPO
	loadDataTables: LoadDataTablesPO
	selectCausalEstimatorsPage: SelectCausalEstimatorsPO
	estimateCausalEffect: EstimateCausalEffectPO
	evaluateHypothesis: EvaluateHypothesisPO
}

export function createPageObjects(page: Page): PageObjects {
	const header = new Header(page)
	const defineCausalQuestion = new DefineCausalQuestionPO(page)
	const considerAlternativeDefinitions = new ConsiderAlternativeDefinitionsPO(
		page,
	)
	const considerRelevantVariables = new ConsiderRelevantVariablesPO(page)
	const considerVariableRelationships = new ConsiderVariableRelationshipsPO(
		page,
	)
	const loadDataTables = new LoadDataTablesPO(page)
	const selectCausalEstimators = new SelectCausalEstimatorsPO(page)
	const estimateCausalEffect = new EstimateCausalEffectPO(page)
	const evaluateHypothesis = new EvaluateHypothesisPO(page)

	return {
		header,
		defineCausalQuestion,
		considerAlternativeDefinitions,
		considerRelevantVariables,
		considerVariableRelationships,
		loadDataTables,
		selectCausalEstimators,
		estimateCausalEffect,
		evaluateHypothesis,
	}
}
