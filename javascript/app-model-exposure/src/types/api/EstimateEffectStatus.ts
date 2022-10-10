/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CovariateBalance } from '../visualization/CovariateBalance.js'
import type { StatusResponse } from './StatusResponse.js'

export interface EstimateEffectStatus extends StatusResponse {
	results?: EstimatedEffect[]
}

export interface EstimatedEffect extends EstimateIdentifier {
	id: string
	population_name: string
	population_size: number
	treatment: string
	outcome: string
	estimated_effect: number
	covariate_balance: CovariateBalance | null
}

export interface EstimateIdentifier {
	population_type: string
	treatment_type: string
	outcome_type: string
	causal_model: string
	estimator: string
}
