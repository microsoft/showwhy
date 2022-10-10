/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ModelSpec } from '../types/api/EstimateEffectRequest.js'
import type { AlternativeModels } from '../types/experiments/AlternativeModels.js'
import type { Maybe } from '../types/primitives.js'

export function buildModelLevel(
	modelName: string,
	model: AlternativeModels,
): Maybe<ModelSpec> {
	const modelConfounders = [...model.confounders]
	const modelOutcome = [...model.outcomeDeterminants]
	if (
		!modelConfounders.length &&
		!modelOutcome.length &&
		modelName !== 'Unadjusted'
	) {
		return undefined
	}

	return {
		type: `${modelName} Model`,
		label: `${modelName} Model`,
		confounders: modelConfounders,
		effect_modifiers: modelOutcome,
	}
}
