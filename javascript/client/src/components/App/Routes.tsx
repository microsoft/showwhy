/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { lazy, memo } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Pages } from '~types'

const DescribeElementsPage = lazy(
	() =>
		/* webpackChunkName: "DescribeElementsPage" */ import(
			'../../pages/ModelDomain/DescribeElementsPage'
		),
)

const ConsiderAlternativeDefinitionsPage = lazy(
	() =>
		/* webpackChunkName: "ConsiderAlternativeDefinitionsPage" */ import(
			'../../pages/ModelDomain/ConsiderAlternativeDefinitionsPage'
		),
)

const ConsiderCausalFactorsPage = lazy(
	() =>
		/* webpackChunkName: "ConsiderCausalFactorsPage" */ import(
			'../../pages/ModelDomain/ConsiderCausalFactorsPage'
		),
)

const DefineFactorsPage = lazy(
	() =>
		/* webpackChunkName: "DefineFactorsPage" */ import(
			'../../pages/ModelDomain/DefineFactorsPage'
		),
)

const ConfirmPage = lazy(
	() =>
		/* webpackChunkName: "ConfirmAlternativeModelsPage" */ import(
			'../../pages/ModelDomain/ConfirmAlternativeModelsPage'
		),
)

const LoadDataPage = lazy(
	() =>
		/* webpackChunkName: "LoadDataPage" */ import(
			'../../pages/PrepareData/LoadDataPage'
		),
)

const ProcessDataPage = lazy(
	() =>
		/* webpackChunkName: "ProcessDataPage" */ import(
			'../../pages/PrepareData/ProcessDataPage'
		),
)

const ConfirmDataPage = lazy(
	() =>
		/* webpackChunkName: "ConfirmDataPage" */ import(
			'../../pages/PrepareData/ConfirmDataPage'
		),
)

const SelectCausalEstimatorsPage = lazy(
	() =>
		/* webpackChunkName: "SelectCausalEstimatorsPage" */ import(
			'../../pages/PerformAnalysis/SelectCausalEstimatorsPage'
		),
)
const EstimateCausalEffects = lazy(
	() =>
		/* webpackChunkName: "EstimateCausalEffects" */ import(
			'../../pages/PerformAnalysis/EstimateCausalEffectsPage'
		),
)

const ExploreSpecificationCurvePage = lazy(
	() =>
		/* webpackChunkName: "ExploreSpecificationCurvePage" */ import(
			'../../pages/PerformAnalysis/ExploreSpecificationCurvePage'
		),
)

const EvaluateHypothesisPage = lazy(
	() =>
		/* webpackChunkName: "EvaluateHypothesisPage" */ import(
			'../../pages/PerformAnalysis/EvaluateHypothesisPage'
		),
)

export const Routes: React.FC = memo(function Routes() {
	return (
		<Switch>
			<Redirect exact from="/" to={Pages.DefineElements} />
			<Route path={Pages.DefineElements} component={DescribeElementsPage} />
			<Route
				path={Pages.ConsiderCausalFactors}
				component={ConsiderCausalFactorsPage}
			/>
			<Route path={Pages.DefineFactors} component={DefineFactorsPage} />
			<Route
				path={Pages.Alternative}
				component={ConsiderAlternativeDefinitionsPage}
			/>
			<Route path={Pages.Confirm} component={ConfirmPage} />
			<Route path={Pages.LoadData} component={LoadDataPage} />
			<Route path={Pages.ProcessData} component={ProcessDataPage} />
			<Route path={Pages.ConfirmData} component={ConfirmDataPage} />
			<Route
				path={Pages.SelectCausalEstimators}
				component={SelectCausalEstimatorsPage}
			/>
			<Route
				path={Pages.EstimateCausalEffects}
				component={EstimateCausalEffects}
			/>
			<Route
				path={Pages.SpecificationCurvePage}
				component={ExploreSpecificationCurvePage}
			/>
			<Route
				path={Pages.EvaluateHypothesisPage}
				component={EvaluateHypothesisPage}
			/>
		</Switch>
	)
})
