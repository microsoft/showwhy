/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { AlternativeModels, AlternativeModelSpec } from '@showwhy/types'

import { buildModelLevel } from './buildModelLevel.js'

export function buildAlternativeModels(
	max: AlternativeModels,
	min: AlternativeModels,
	_interm: AlternativeModels,
	unadju: AlternativeModels,
): AlternativeModelSpec[] {
	const modelsList: AlternativeModelSpec[] = []
	const maximum = buildModelLevel('Maximum', max)
	if (maximum) {
		modelsList.push(maximum)
	}

	const minimum = buildModelLevel('Minimum', min)
	if (minimum) {
		modelsList.push(minimum)
	}

	const unadjusted = buildModelLevel('Unadjusted', unadju)
	if (unadjusted) {
		modelsList.push(unadjusted)
	}

	return modelsList
}
