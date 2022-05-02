/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import type {
	BeliefDegree,
	CausalFactorType,
	Cause,
	FlatCausalFactor,
	Handler,
} from '@showwhy/types'
import { useCallback } from 'react'

export function useOnChangeCauses(
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: (id: string, value: Cause) => void,
): (selected: IDropdownOption, type: CausalFactorType, id?: string) => void {
	return useCallback(
		(selected: IDropdownOption, type: CausalFactorType, id?: string) => {
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
