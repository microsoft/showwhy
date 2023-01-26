/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatedEffect } from '../types/api/EstimateEffectStatus.js'
import type { Estimator } from '../types/estimators/Estimator.js'

export function returnConfidenceIntervalMapping(
	estimatedEffect: EstimatedEffect[] | undefined,
	estimators: Estimator[] | undefined,
): string[] | undefined {
	return estimatedEffect?.flatMap((x) =>
		estimators?.find((e) => e.type.toLowerCase() === x.estimator.toLowerCase())
			?.confidenceInterval
			? x.id
			: [],
	)
}
