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
	LoadData = '/prepare/load',
	DeriveDataVariables = '/prepare/data-variables',
	ConfirmData = '/prepare/confirm',
	SelectCausalEstimators = '/perform/estimators',
	EstimateCausalEffects = '/perform/causal-effects',
	EvaluateHypothesisPage = '/perform/evaluate',
}

export enum PageType {
	Why = 'why',
	Who = 'who',
	When = 'when',
	How = 'how',
	Population = 'population',
	Exposure = 'exposure',
	Outcome = 'outcome',
	Control = 'control',
	CauseExposure = 'cause-exposure',
	CauseOutcome = 'cause-outcome',
}
