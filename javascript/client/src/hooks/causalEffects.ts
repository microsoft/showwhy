/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	AlternativeModels,
	CausalModelLevel,
	Experiment,
} from '@showwhy/types'
import { useMemo } from 'react'

import { useExperiment } from '~state/experiment'

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
): ReturnType<typeof useCausalEffectsTestable> {
	return useCausalEffectsTestable(
		useExperiment(),
		useAlternativeModels(causalLevel),
	)
}

export function useCausalEffectsTestable(
	question: Experiment,
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
