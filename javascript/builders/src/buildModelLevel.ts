/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Maybe,
	AlternativeModelSpec,
	AlternativeModels,
} from '@showwhy/types'

export function buildModelLevel(
	modelName: string,
	model: AlternativeModels,
): Maybe<AlternativeModelSpec> {
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
		outcome_determinants: modelOutcome,
	}
}
