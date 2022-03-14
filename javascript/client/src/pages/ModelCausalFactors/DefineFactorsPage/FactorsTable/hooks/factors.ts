/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	CausalFactorType,
	Cause,
	FlatCausalFactor,
	Setter,
} from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { replaceItemAtIndex } from '~utils'

export function useFlatFactorsList(
	causalFactors: CausalFactor[],
	causeType: CausalFactorType,
	values?: CausalFactor[],
): FlatCausalFactor[] {
	return useMemo((): FlatCausalFactor[] => {
		return causalFactors.map((factor: CausalFactor) => {
			const equal =
				values
					?.find(existing => existing.id === factor.id)
					?.causes?.find(c => c.type === causeType) ||
				(factor.causes && factor.causes.find(c => c.type === causeType))

			return {
				variable: factor.variable,
				causes: equal?.causes || false,
				degree: equal?.degree ?? null,
				reasoning: equal?.reasoning || '',
				id: factor.id,
				description: factor.description,
			}
		}) as FlatCausalFactor[]
	}, [causalFactors, values, causeType])
}

export function useSaveFactors(
	causalFactors: CausalFactor[],
	causeType: CausalFactorType,
	setValues: Setter<CausalFactor[]>,
	save: (factors: CausalFactor[]) => void,
): (id: string, value: Cause) => void {
	return useCallback(
		(id: string, newValue: Cause) => {
			const index = causalFactors.findIndex(v => v.id === id)
			const oldFactor = causalFactors.find(x => x.id === id)
			const oldCauses = oldFactor?.causes?.filter(
				x => x.type !== causeType,
			) as Cause[]
			const causes = [
				...(oldCauses || []),
				{
					causes: newValue.causes,
					degree: newValue.degree ?? null,
					reasoning: newValue.reasoning,
					type: causeType,
				} as Cause,
			]
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
		[causalFactors, setValues, causeType, save],
	)
}
