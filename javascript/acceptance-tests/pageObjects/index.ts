/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from '@playwright/test'

import { Header } from './Header'
import { modelCausalQuestionPO } from './modelCausalQuestionPO'
import { ConsiderAlternativeDefinitionsPO } from './ConsiderAlternativeDefinitionsPO'
import { ConsiderRelevantVariablesPO } from './ConsiderRelevantVariablesPO'
import { ConsiderVariableRelationshipsPO } from './ConsiderVariableRelationshipsPO'
import { LoadDataTablesPage } from './LoadDataTablesPage'
import { SelectCausalEstimatorsPage } from './SelectCausalEstimatorsPage'
import { ExploreSpecificationCurvePage } from './ExploreSpecificationCurvePage'
import { EvaluateHypothesisPage } from './EvaluateHypothesisPage'

export interface PageObjects {
	header: Header
	modelCausalQuestion: modelCausalQuestionPO
	considerAlternativeDefinitions: ConsiderAlternativeDefinitionsPO
	considerRelevantVariables: ConsiderRelevantVariablesPO
	considerVariableRelationships: ConsiderVariableRelationshipsPO
	loadDataTablesPage: LoadDataTablesPage
	selectCausalEstimatorsPage: SelectCausalEstimatorsPage
	exploreSpecificationCurvePage: ExploreSpecificationCurvePage
	evaluateHypothesisPage: EvaluateHypothesisPage
}

export function createPageObjects(page: Page): PageObjects {
	const header = new Header(page)
	const modelCausalQuestion = new modelCausalQuestionPO(page)
	const considerAlternativeDefinitions = new ConsiderAlternativeDefinitionsPO(
		page,
	)
	const considerRelevantVariables = new ConsiderRelevantVariablesPO(page)
	const considerVariableRelationships = new ConsiderVariableRelationshipsPO(
		page,
	)
	const loadDataTablesPage = new LoadDataTablesPage(page)
	const selectCausalEstimatorsPage = new SelectCausalEstimatorsPage(page)
	const exploreSpecificationCurvePage = new ExploreSpecificationCurvePage(page)
	const evaluateHypothesisPage = new EvaluateHypothesisPage(page)

	return {
		header,
		modelCausalQuestion,
		considerAlternativeDefinitions,
		considerRelevantVariables,
		considerVariableRelationships,
		loadDataTablesPage,
		selectCausalEstimatorsPage,
		exploreSpecificationCurvePage,
		evaluateHypothesisPage,
	}
}
