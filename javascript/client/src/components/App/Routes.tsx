/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { lazy, memo } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

import { Pages } from '../../constants'

const DefineCausalQuestionPage = lazy(
	() =>
		/* webpackChunkName: "DefineCausalQuestion" */ import(
			'../../pages/ModelDomain/DefineCausalQuestion'
		),
)

const ConsiderAlternativeDefinitionsPage = lazy(
	() =>
		/* webpackChunkName: "ConsiderAlternativeDefinitionsPage" */ import(
			'../../pages/ModelDomain/ConsiderAlternativeDefinitionsPage'
		),
)

const ConsiderRelevantVariablesPage = lazy(
	() =>
		/* webpackChunkName: "ConsiderRelevantVariablesPage" */ import(
			'../../pages/ModelDomain/ConsiderRelevantVariablesPage'
		),
)

const ConsiderVariableRelationshipsPage = lazy(
	() =>
		/* webpackChunkName: "ConsiderVariableRelationshipsPage" */ import(
			'../../pages/ModelDomain/ConsiderVariableRelationshipsPage'
		),
)

const ConfirmDomainModelsPage = lazy(
	() =>
		/* webpackChunkName: "ConfirmDomainModelsPage" */ import(
			'../../pages/ModelDomain/ConfirmDomainModelsPage'
		),
)

const LoadDataPage = lazy(
	() =>
		/* webpackChunkName: "LoadDataPage" */ import(
			'../../pages/PrepareData/LoadDataPage'
		),
)

const DeriveDataVariablesPage = lazy(
	() =>
		/* webpackChunkName: "DeriveDataVariablesPage" */ import(
			'../../pages/PrepareData/DeriveDataVariablesPage'
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

const EstimateCausalEffectsPage = lazy(
	() =>
		/* webpackChunkName: "EstimateCausalEffectsPage" */ import(
			'../../pages/PerformAnalysis/EstimateCausalEffectsPage'
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
			<Redirect exact from="/" to={Pages.CausalQuestion} />
			<Route path={Pages.CausalQuestion} component={DefineCausalQuestionPage} />
			<Route
				path={Pages.RelevantVariables}
				component={ConsiderRelevantVariablesPage}
			/>
			<Route
				path={Pages.VariablesRelationships}
				component={ConsiderVariableRelationshipsPage}
			/>
			<Route
				path={Pages.AlternativeDefinitions}
				component={ConsiderAlternativeDefinitionsPage}
			/>
			<Route path={Pages.ConfirmDomain} component={ConfirmDomainModelsPage} />
			<Route path={Pages.LoadData} component={LoadDataPage} />
			<Route
				path={Pages.DeriveDataVariables}
				component={DeriveDataVariablesPage}
			/>
			<Route path={Pages.ConfirmData} component={ConfirmDataPage} />
			<Route
				path={Pages.SelectCausalEstimators}
				component={SelectCausalEstimatorsPage}
			/>
			<Route
				path={Pages.EstimateCausalEffects}
				component={EstimateCausalEffectsPage}
			/>
			<Route
				path={Pages.EvaluateHypothesisPage}
				component={EvaluateHypothesisPage}
			/>
		</Switch>
	)
})
