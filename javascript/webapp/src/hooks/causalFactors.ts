/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	AlternativeModels,
	CausalFactor,
	Cause,
	OptionalId,
} from '@showwhy/types'
import {
	BeliefDegree,
	CausalFactorType,
	CausalModelLevel,
} from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { v4 } from 'uuid'

import { useCausalFactors, useSetCausalFactors } from '~state/causalFactors'
import { replaceItemAtIndex } from '~utils/arrays'

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

export function useAlternativeModels(
	causalLevel: CausalModelLevel,
	shouldUseVariable = true,
): AlternativeModels {
	return useAlternativeModelsTestable(
		causalLevel,
		shouldUseVariable,
		useCausalFactors(),
	)
}

export function useAlternativeModelsTestable(
	causalLevel: CausalModelLevel,
	shouldUseVariable: boolean,
	causalFactors: CausalFactor[],
): AlternativeModels {
	return useMemo(() => {
		const confoundersArray: string[] = []
		const outcomeArray: string[] = []
		const exposureArray: string[] = []

		causalFactors.forEach((factor: CausalFactor) => {
			let variable = factor.column || ''
			if (shouldUseVariable) {
				variable = factor.variable
			}
			const { causes = {} as Cause } = factor || {}

			const degreeExposure =
				causes[CausalFactorType.CauseExposure] ?? BeliefDegree.None
			const degreeOutcome =
				causes[CausalFactorType.CauseOutcome] ?? BeliefDegree.None

			if (degreeExposure > 0 && degreeOutcome > 0) {
				if (shouldIncludeInDegree(degreeExposure, causalLevel)) {
					confoundersArray.push(variable)
				}
			}

			if (
				degreeOutcome > 0 &&
				(!degreeExposure || degreeExposure === BeliefDegree.None)
			) {
				if (shouldIncludeInDegree(degreeOutcome, causalLevel)) {
					outcomeArray.push(variable)
				}
			}
			if (
				degreeExposure > 0 &&
				(!degreeOutcome || degreeOutcome === BeliefDegree.None)
			) {
				if (shouldIncludeInDegree(degreeExposure, causalLevel)) {
					exposureArray.push(variable)
				}
			}
		})

		return {
			confounders: confoundersArray,
			outcomeDeterminants: outcomeArray,
			exposureDeterminants: exposureArray,
		}
	}, [causalFactors, causalLevel, shouldUseVariable])
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
