/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StatusResponse } from './StatusResponse.js'

export interface ShapStatus extends StatusResponse {
	taskId?: string //runHistory taskId
	results?: Shap[][]
}

export interface Shap {
	estimate_id: string
	shap_population_name: string
	shap_treatment: number
	shap_outcome: number
	shap_causal_model: number
	shap_estimator: number
}
