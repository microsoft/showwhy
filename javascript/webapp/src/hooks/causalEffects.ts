/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AlternativeModels,
	CausalModelLevel,
	Question,
} from '@showwhy/types'
import { useMemo } from 'react'

import { useQuestion } from '~state/question'

import { useAlternativeModels } from './causalFactors'

export interface CausalEffectsProps {
	confounders: string[]
	outcomeDeterminants: string[]
	exposureDeterminants: string[]
	generalExposure: string
	generalOutcome: string
}

export function useCausalEffects(
	causalLevel: CausalModelLevel,
): CausalEffectsProps {
	return useCausalEffectsTestable(
		useQuestion(),
		useAlternativeModels(causalLevel),
	)
}

export function useCausalEffectsTestable(
	question: Question,
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
