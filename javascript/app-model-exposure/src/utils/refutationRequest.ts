/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatedEffect } from '../types/api/EstimateEffectStatus.js'
import type { Estimator } from '../types/estimators/Estimator.js'

export function returnRefutationMapping(
	estimatedEffect: EstimatedEffect[] | undefined,
	estimators: Estimator[] | undefined,
) {
	const mapping = new Map<string, number>()
	estimatedEffect?.forEach(x => {
		mapping.set(
			x.id,
			estimators?.find(e => e.type.toLowerCase() === x.estimator.toLowerCase())
				?.refutations as number,
		)
	})

	return mapping
}
