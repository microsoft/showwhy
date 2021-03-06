/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { OrchestratorStatusResponse } from './OrchestratorStatusResponse.js'
import type { PartialResults } from './PartialResults.js'

export interface EstimateEffectStatusResponse
	extends OrchestratorStatusResponse {
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
