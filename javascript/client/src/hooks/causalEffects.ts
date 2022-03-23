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

import { useAlternativeModels, useExcludedFactors } from './causalFactors'

export interface CausalEffectsProps {
	confounders: string[]
	outcomeDeterminants: string[]
	exposureDeterminants: string[]
	generalExposure: string
	generalOutcome: string
	excludedFactors: string[]
	excludedMessage: string
}

export function useCausalEffects(
	causalLevel: CausalModelLevel,
): ReturnType<typeof useCausalEffectsTestable> {
	return useCausalEffectsTestable(
		useExperiment(),
		useExcludedFactors(),
		useAlternativeModels(causalLevel),
	)
}

export function useCausalEffectsTestable(
	question: Experiment,
	excludedFactors: string[],
	{ confounders, outcomeDeterminants, exposureDeterminants }: AlternativeModels,
): CausalEffectsProps {
	const excludedMessage = useMemo((): string => {
		return `${excludedFactors.length} potential control${
			excludedFactors.length > 1 ? 's were' : ' was'
		} excluded based on ambiguous causal directions: ${excludedFactors.join(
			', ',
		)}.`
	}, [excludedFactors])

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
		excludedFactors,
		excludedMessage,
	}
}
