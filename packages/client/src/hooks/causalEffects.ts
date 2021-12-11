/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'
import { useAlternativeModels, useExcludedFactors } from './causalFactors'
import { CausalModelLevel } from '~enums'
import { AlternativeModels, DescribeElements } from '~interfaces'
import { useDefineQuestion } from '~state'
import { GenericObject } from '~types'

export const useCausalEffects = (
	causalLevel: CausalModelLevel,
): GenericObject => {
	return useCausalEffectsTestable(
		useDefineQuestion(),
		useExcludedFactors(),
		useAlternativeModels(causalLevel),
	)
}

export function useCausalEffectsTestable(
	question: DescribeElements,
	excludedFactors: string[],
	{ confounders, outcomeDeterminants }: AlternativeModels,
): GenericObject {
	const excludedMessage = useMemo((): string => {
		return `${excludedFactors.length} potential control${
			excludedFactors.length > 1 ? 's were' : ' was'
		} excluded based on ambiguous causal directions: ${excludedFactors.join(
			', ',
		)}.`
	}, [excludedFactors])

	const generalExposure = useMemo((): string => {
		return question.exposure?.label || ''
	}, [question])

	const generalOutcome = useMemo((): string => {
		return question.outcome?.label || ''
	}, [question])

	return {
		confounders,
		outcomeDeterminants,
		generalExposure,
		generalOutcome,
		excludedFactors,
		excludedMessage,
	}
}
