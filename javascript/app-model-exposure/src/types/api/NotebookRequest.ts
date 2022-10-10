/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ConfidenceIntervalRequest } from './ConfidenceIntervalRequest.js'
import type { EstimateEffectRequest } from './EstimateEffectRequest.js'
import type { EstimateIdentifier } from './EstimateEffectStatus.js'
import type { RefutationRequest } from './RefutationRequest.js'

export interface NotebookRequest {
	estimate_effect_params: EstimateEffectRequest
	refuter_params: RefutationRequest
	confidence_interval_params: ConfidenceIntervalRequest
	significance_test_params: {
		filter_by: EstimateIdentifier[]
	}
}
