/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Page } from '@playwright/test'

import { Header } from './Header'
import { DescribeElementsPage } from './DescribeElementsPage'
import { DefineModelPage } from './DefineModelPage'
import { ModelCausalFactorsPage } from './ModelCausalFactorsPage'
import { DefineFactorsPage } from './DefineFactorsPage'
import { LoadDataTablesPage } from './LoadDataTablesPage'
import { SelectCausalEstimatorsPage } from './SelectCausalEstimatorsPage'
import { EstimateCausalEffectsPage } from './EstimateCausalEffectsPage'
import { ExploreSpecificationCurvePage } from './ExploreSpecificationCurvePage'
import { EvaluateHypothesisPage } from './EvaluateHypothesisPage'

export interface PageObjects {
	header: Header
	describeElementsPage: DescribeElementsPage
	defineModelPage: DefineModelPage
	modelCausalFactorsPage: ModelCausalFactorsPage
	defineFactorsPage: DefineFactorsPage
	loadDataTablesPage: LoadDataTablesPage
	selectCausalEstimatorsPage: SelectCausalEstimatorsPage
	estimateCausalEffectsPage: EstimateCausalEffectsPage
	exploreSpecificationCurvePage: ExploreSpecificationCurvePage
	evaluateHypothesisPage: EvaluateHypothesisPage
}

export function createPageObjects(page: Page): PageObjects {
	const header = new Header(page)
	const describeElementsPage = new DescribeElementsPage(page)
	const defineModelPage = new DefineModelPage(page)
	const modelCausalFactorsPage = new ModelCausalFactorsPage(page)
	const defineFactorsPage = new DefineFactorsPage(page)
	const loadDataTablesPage = new LoadDataTablesPage(page)
	const selectCausalEstimatorsPage = new SelectCausalEstimatorsPage(page)
	const estimateCausalEffectsPage = new EstimateCausalEffectsPage(page)
	const exploreSpecificationCurvePage = new ExploreSpecificationCurvePage(page)
	const evaluateHypothesisPage = new EvaluateHypothesisPage(page)

	return {
		header,
		describeElementsPage,
		defineModelPage,
		modelCausalFactorsPage,
		defineFactorsPage,
		loadDataTablesPage,
		selectCausalEstimatorsPage,
		estimateCausalEffectsPage,
		exploreSpecificationCurvePage,
		evaluateHypothesisPage,
	}
}
