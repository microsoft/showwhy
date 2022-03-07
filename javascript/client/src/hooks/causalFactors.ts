/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	OptionalId,
	AlternativeModels,
	CausalFactor,
} from '@showwhy/types'
import { BeliefDegree, CausalModelLevel } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { v4 } from 'uuid'
// HACK to pass the unit tests
import { useCausalFactors, useSetCausalFactors } from '~state/causalFactors'
import { replaceItemAtIndex } from '~utils/arrays'

export function useExcludedFactors(): string[] {
	return useExcludedFactorsTestable(useCausalFactors())
}

export function useExcludedFactorsTestable(
	causalFactors: CausalFactor[],
): string[] {
	return useMemo((): string[] => {
		return causalFactors
			.filter((factor: CausalFactor) => {
				const keys = Object.keys(factor.causes || {})
				if (keys.length > 1) {
					const lengthCaused = keys.filter(r => /^caused/.test(r)).length
					const lengthCauses = keys.filter(r =>
						/^cause(Exposure|Outcome)/.test(r),
					).length
					if (lengthCaused > 0 && lengthCauses > 0) {
						return factor
					}
				}
				return false
			})
			?.map(factor => factor.variable)
	}, [causalFactors])
}

function shouldIncludeInDegree(
	degree: BeliefDegree,
	causalLevel: CausalModelLevel,
): boolean {
	if (
		causalLevel === CausalModelLevel.Maximum ||
		(causalLevel === CausalModelLevel.Intermediate &&
			degree >= BeliefDegree.Moderate) ||
		(causalLevel === CausalModelLevel.Minimum && degree === BeliefDegree.Strong)
	) {
		return true
	}

	return false
}

export function useDeleteCausalFactor(): (
	newCausalFactor: CausalFactor,
) => void {
	return useDeleteCausalFactorTestable(
		useCausalFactors(),
		useSetCausalFactors(),
	)
}

export function useDeleteCausalFactorTestable(
	causalFactors: CausalFactor[],
	setCausalFactors: SetterOrUpdater<CausalFactor[]>,
): (newCausalFactor: CausalFactor) => void {
	return useCallback(
		(causalFactor: CausalFactor) => {
			const newList = causalFactors.filter(x => x.id !== causalFactor.id)

			setCausalFactors(newList)
		},
		[setCausalFactors, causalFactors],
	)
}

export function useAlternativeModels(
	causalLevel: CausalModelLevel,
	shouldUseVariable = true,
): AlternativeModels {
	return useAlternativeModelsTestable(
		causalLevel,
		shouldUseVariable,
		useCausalFactors(),
		useExcludedFactors(),
	)
}

export function useAlternativeModelsTestable(
	causalLevel: CausalModelLevel,
	shouldUseVariable: boolean,
	causalFactors: CausalFactor[],
	excludedFactors: string[],
): AlternativeModels {
	return useMemo(() => {
		const confoundersArray: string[] = []
		const outcomeArray: string[] = []

		causalFactors
			.filter(c => !excludedFactors.includes(c.variable))
			.forEach((factor: CausalFactor) => {
				let variable = factor.column || ''
				if (shouldUseVariable) {
					variable = factor.variable
				}
				const causes = factor.causes || {}
				const outcome = 'causeOutcome'
				const exposure = 'causeExposure'

				if (causes[exposure]?.causes && causes[outcome]?.causes) {
					const degree = causes[exposure]?.degree
					if (degree && shouldIncludeInDegree(degree, causalLevel)) {
						confoundersArray.push(variable)
					}
				}

				if (causes[outcome]?.causes && !causes[exposure]?.causes) {
					const degree = causes[outcome]?.degree
					if (degree && shouldIncludeInDegree(degree, causalLevel)) {
						outcomeArray.push(variable)
					}
				}
			})
		return { confounders: confoundersArray, outcomeDeterminants: outcomeArray }
	}, [causalFactors, excludedFactors, causalLevel, shouldUseVariable])
}

export function useAddOrEditFactor(): (
	factor: OptionalId<CausalFactor>,
) => void {
	return useAddOrEditFactorTestable(useCausalFactors(), useSetCausalFactors())
}

export function useAddOrEditFactorTestable(
	causalFactors: CausalFactor[],
	setCausalFactors: SetterOrUpdater<CausalFactor[]>,
): (factor: OptionalId<CausalFactor>) => void {
	return useCallback(
		(factor: OptionalId<CausalFactor>, factors = causalFactors) => {
			const exists = factors.find(f => f.id === factor?.id) || {}

			const existsIndex = factors.findIndex(f => f.id === factor?.id)
			const newFactor = {
				...exists,
				...factor,
				id: factor?.id ?? v4(),
			} as CausalFactor

			let newFactorList = factors

			if (existsIndex >= 0) {
				newFactorList = replaceItemAtIndex(
					newFactorList,
					existsIndex,
					newFactor,
				)
			} else {
				newFactorList = [...newFactorList, newFactor]
			}

			setCausalFactors(newFactorList)
		},
		[causalFactors, setCausalFactors],
	)
}
