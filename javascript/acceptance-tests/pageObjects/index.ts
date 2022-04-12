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
	defineCausalQuestionPage: DefineCausalQuestionPO
	considerAlternativeDefinitionsPage: ConsiderAlternativeDefinitionsPO
	considerRelevantVariablesPage: ConsiderRelevantVariablesPO
	considerVariableRelationshipsPage: ConsiderVariableRelationshipsPO
	loadDataTablesPage: LoadDataTablesPO
	selectCausalEstimatorsPage: SelectCausalEstimatorsPO
	estimateCausalEffectPage: EstimateCausalEffectPO
	evaluateHypothesisPage: EvaluateHypothesisPO
}

export function createPageObjects(page: Page): PageObjects {
	const header = new Header(page)
	const defineCausalQuestionPage = new DefineCausalQuestionPO(page)
	const considerAlternativeDefinitionsPage =
		new ConsiderAlternativeDefinitionsPO(page)
	const considerRelevantVariablesPage = new ConsiderRelevantVariablesPO(page)
	const considerVariableRelationshipsPage = new ConsiderVariableRelationshipsPO(
		page,
	)
	const loadDataTablesPage = new LoadDataTablesPO(page)
	const selectCausalEstimatorsPage = new SelectCausalEstimatorsPO(page)
	const estimateCausalEffectPage = new EstimateCausalEffectPO(page)
	const evaluateHypothesisPage = new EvaluateHypothesisPO(page)

	return {
		header,
		defineCausalQuestionPage,
		considerAlternativeDefinitionsPage,
		considerRelevantVariablesPage,
		considerVariableRelationshipsPage,
		loadDataTablesPage,
		selectCausalEstimatorsPage,
		estimateCausalEffectPage,
		evaluateHypothesisPage,
	}
}
