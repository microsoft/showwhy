/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum Pages {
	CausalQuestion = '/model/causal-question',
	AlternativeDefinitions = '/model/alternative',
	RelevantVariables = '/model/relevant-variables',
	VariablesRelationships = '/model/variable-relationships',
	ConfirmDomain = '/model/confirm-domain',
	Define = '/define',
	LoadData = '/prepare/load',
	DeriveDataVariables = '/prepare/data-variables',
	ConfirmData = '/prepare/confirm',
	EstimateCausalEffects = '/perform/effects',
	SelectCausalEstimators = '/perform/estimators',
	RefutationTests = '/perform/refutation',
	SpecificationCurvePage = '/perform/estimate-distribution',
	EvaluateHypothesisPage = '/perform/evaluate',
	ReportsPage = '/reports/graph',
}
