/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ModelSpec } from '../types/api/EstimateEffectRequest.js'
import type { AlternativeModels } from '../types/experiments/AlternativeModels.js'
import { buildModelLevel } from './buildModelLevel.js'

export function buildAlternativeModels(
	max: AlternativeModels,
	min: AlternativeModels,
	_interm: AlternativeModels,
	unadju: AlternativeModels,
): ModelSpec[] {
	const modelsList: ModelSpec[] = []
	const maximum = buildModelLevel('Maximum', max)
	if (maximum) {
		modelsList.push(maximum)
	}

	const minimum = buildModelLevel('Minimum', min)
	if (minimum) {
		modelsList.push(minimum)
	}

	const unadjusted = buildModelLevel('Unadjusted', unadju)
	modelsList.push(unadjusted as ModelSpec)

	return modelsList
}
