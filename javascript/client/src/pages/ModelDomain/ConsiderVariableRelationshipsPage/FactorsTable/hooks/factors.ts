/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	Cause,
	FlatCausalFactor,
	Setter,
} from '@showwhy/types'
import { CausalFactorType } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { replaceItemAtIndex } from '~utils'

export function useFlatFactorsList(
	causalFactors: CausalFactor[],
	values?: CausalFactor[],
): FlatCausalFactor[] {
	return useMemo((): FlatCausalFactor[] => {
		return causalFactors.map((factor: CausalFactor) => {
			const equal =
				values?.find(existing => existing.id === factor.id)?.causes ||
				factor.causes ||
				({} as FlatCausalFactor)

			return {
				variable: factor.variable,
				[CausalFactorType.CauseExposure]:
					equal[CausalFactorType.CauseExposure] ?? null,
				[CausalFactorType.CauseOutcome]:
					equal[CausalFactorType.CauseOutcome] ?? null,
				reasoning: equal.reasoning || '',
				id: factor.id,
				description: factor.description,
			}
		}) as FlatCausalFactor[]
	}, [causalFactors, values])
}

export function useSaveFactors(
	causalFactors: CausalFactor[],
	setValues: Setter<CausalFactor[]>,
	save: (factors: CausalFactor[]) => void,
): (id: string, value: Cause) => void {
	return useCallback(
		(id: string, newValue: Cause) => {
			const index = causalFactors.findIndex(v => v.id === id)
			const oldFactor = causalFactors.find(x => x.id === id)
			const oldCauses = oldFactor?.causes

			const causes = {
				...(oldCauses || {}),
				[CausalFactorType.CauseExposure]:
					newValue[CausalFactorType.CauseExposure] ?? null,
				[CausalFactorType.CauseOutcome]:
					newValue[CausalFactorType.CauseOutcome] ?? null,
				reasoning: newValue.reasoning,
			} as Cause
			const factorObject = {
				...oldFactor,
				causes,
			} as CausalFactor

			const newFactorsList = replaceItemAtIndex(
				causalFactors,
				index,
				factorObject,
			)
			setValues(newFactorsList)
			save(newFactorsList)
		},
		[causalFactors, setValues, save],
	)
}
