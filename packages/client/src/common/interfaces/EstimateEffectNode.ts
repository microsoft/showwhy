/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AdditionalProperties, StatusResponse } from '~interfaces'

export interface NodeData extends AdditionalProperties {
	type: string
	id: string
	value: string
	name: string
	result?: string
}

export interface PartialResults {
	id: string
	task_id: string
	execution_id: string
	partial: boolean
	state: string
	error?: string
	traceback?: string
	node_data?: NodeData
	refuter_bootstrap: number
	refuter_add_unobserved_common_cause: number
	refuter_random_common_cause: number
	refuter_placebo_treatment: number
	refuter_data_subset: number
	population_type: string
	population_name: string
	population_size: number
	treatment_type: string
	treatment: string
	outcome_type: string
	outcome: string
	causal_model: string
	estimator: string
	estimator_config: {
		[key: string]: string | number
	}
	estimated_effect: number
	time: number
}

export interface EstimateEffectStatusResponse {
	total_results: number
	refuters: string[]
	estimated_effect_completed: number
	completed: number
	failed: number
	partial_results: PartialResults[]
	refute_completed: number
	confidence_interval_completed: number
	shap_completed: number
}

export interface CheckStatus
	extends EstimateEffectStatusResponse,
		StatusResponse {}
