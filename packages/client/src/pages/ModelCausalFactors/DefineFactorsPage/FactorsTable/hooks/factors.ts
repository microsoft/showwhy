/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'
import { SetFactors } from './types'
import {
	CausalFactor,
	Cause,
	ExposureAndOutcomeCauses,
	FlatCausalFactor,
} from '~types'
import { replaceItemAtIndex } from '~utils'

export function useFlatFactorsList(
	causalFactors: CausalFactor[],
	causeType: string,
	values?: CausalFactor[],
): FlatCausalFactor[] {
	return useMemo((): FlatCausalFactor[] => {
		return causalFactors.map((factor: CausalFactor) => {
			const equal =
				values?.find(existing => existing.id === factor.id) ||
				(factor.causes && factor.causes[causeType])

			return {
				variable: factor.variable,
				causes: equal?.causes || false,
				degree: equal?.degree || null,
				reasoning: equal?.reasoning || '',
				id: factor.id,
				description: factor.description,
			}
		}) as FlatCausalFactor[]
	}, [causalFactors, values, causeType])
}

export function useSaveFactors(
	causalFactors: CausalFactor[],
	causeType: string,
	setValues: SetFactors,
	save: (factors: CausalFactor[]) => void,
): (id: string, value: any) => void {
	return useCallback(
		(id: string, newValue) => {
			setValues(prev => [...(prev || []).filter(x => x.id !== id), newValue])
			const index = causalFactors.findIndex(v => v.id === id)
			const oldFactor = causalFactors.find(x => x.id === id)
			const oldCauses = oldFactor?.causes as ExposureAndOutcomeCauses
			const causes = {
				...oldCauses,
				[causeType]: {
					causes: newValue.causes,
					degree: newValue.degree || null,
					reasoning: newValue.reasoning,
				} as Cause,
			} as ExposureAndOutcomeCauses

			const factorObject = {
				...oldFactor,
				causes,
			} as CausalFactor
			const newFactorsList = replaceItemAtIndex(
				causalFactors,
				index,
				factorObject,
			)
			save(newFactorsList)
		},
		[causalFactors, setValues, causeType, save],
	)
}
