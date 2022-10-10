/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useCausalQuestion } from '../state/causalQuestion.js'
import type { CausalEffectsProps } from '../types/causality/CausalEffects.js'
import type { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import type { AlternativeModels } from '../types/experiments/AlternativeModels.js'
import type { CausalQuestion } from '../types/question/CausalQuestion.js'
import { useAlternativeModels } from './causalFactors.js'

export function useCausalEffects(
	causalLevel: CausalModelLevel,
): CausalEffectsProps {
	return useCausalEffectsTestable(
		useCausalQuestion(),
		useAlternativeModels(causalLevel),
	)
}

export function useCausalEffectsTestable(
	question: CausalQuestion,
	{ confounders, outcomeDeterminants, exposureDeterminants }: AlternativeModels,
): CausalEffectsProps {
	const generalExposure = useMemo(
		() => question.exposure?.label || '',
		[question],
	)

	const generalOutcome = useMemo(
		() => question.outcome?.label || '',
		[question],
	)

	return {
		confounders,
		outcomeDeterminants,
		exposureDeterminants,
		generalExposure,
		generalOutcome,
	}
}
