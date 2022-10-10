/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalityLevel } from '../causality/CausalityLevel.js'

export interface DomainModel {
	type: CausalityLevel
	label?: string
	variable?: string
}

export interface EstimateEffectRequest {
	population_specs: PopulationSpec[]
	treatment_specs: DomainModel[]
	outcome_specs: DomainModel[]
	model_specs: ModelSpec[]
	estimator_specs: EstimatorSpec[]
}

export interface PopulationSpec extends DomainModel {
	dataframe: string
}

export interface ModelSpec {
	type: string
	label: string
	confounders: string[]
	effect_modifiers: string[]
}

export interface EstimatorSpec {
	type: string
	label: string
	require_propensity_score: boolean
	method_name: string
	method_params?: Record<string, unknown>
}
