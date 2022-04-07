/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IComboBoxOption } from '@fluentui/react'
import type {
	Cause,
	FlatCausalFactor,
	Handler,
	BeliefDegree,
} from '@showwhy/types'
// import type { BeliefDegree } from '@showwhy/types'
import { useCallback } from 'react'

// export function useOnChangeCauses(
// 	flatFactorsList: FlatCausalFactor[],
// 	saveNewFactors: (id: string, value: Cause) => void,
// ): (id: string, checked: boolean) => void {
// 	return useCallback(
// 		(id: string, checked: boolean) => {
// 			const newValue =
// 				(flatFactorsList.find(x => x.id === id) as Cause) || ({} as Cause)
// 			newValue.causes = checked
// 			if (checked && !newValue.degree) {
// 				newValue.degree = BeliefDegree.Strong
// 			} else if (!checked) {
// 				newValue.degree = null
// 			}
// 			saveNewFactors(id, newValue)
// 		},
// 		[flatFactorsList, saveNewFactors],
// 	)
// }

export function useOnChangeCauses(
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: (id: string, value: Cause) => void,
): (
	selected: IComboBoxOption,
	type: 'exposure' | 'outcome',
	id?: string,
) => void {
	return useCallback(
		(selected: IComboBoxOption, type: 'exposure' | 'outcome', id?: string) => {
			console.log('On change causes', type)
			const newValue = flatFactorsList.find(x => x.id === id) as Cause
			;(newValue as any)[type] = selected.key as BeliefDegree
			saveNewFactors(id as string, newValue)
		},
		[flatFactorsList, saveNewFactors],
	)
}

export function useOnChangeReasoning(
	flatFactorsList: FlatCausalFactor[],
	toggleMultiline: Handler,
	saveNewFactors: (id: string, value: Cause) => void,
	multiline: boolean,
): (id: string, newText: string) => void {
	return useCallback(
		(id: string, newText: string): void => {
			const newValue = flatFactorsList.find(x => x.id === id) as Cause
			newValue.reasoning = newText

			const newMultiline = (newText?.length || 0) > 50
			if (newMultiline !== multiline) {
				toggleMultiline()
			}
			saveNewFactors(id, newValue)
		},
		[flatFactorsList, toggleMultiline, saveNewFactors, multiline],
	)
}
