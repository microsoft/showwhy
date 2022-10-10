/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ConfidenceInterval } from './ConfidenceIntervalStatus.js'
import type { EstimatedEffect } from './EstimateEffectStatus.js'
import type { Refutation } from './RefutationStatus.js'
import type { Shap } from './ShapStatus.js'

export interface EstimateData
	extends Omit<EstimatedEffect, 'id'>,
		Omit<ConfidenceInterval, 'estimate_id'>,
		Omit<Refutation, 'estimate_id'>,
		Omit<Shap, 'estimate_id'> {
	id?: string
	estimate_id?: string
}
