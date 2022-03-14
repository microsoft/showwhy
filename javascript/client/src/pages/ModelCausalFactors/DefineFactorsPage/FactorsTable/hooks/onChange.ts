/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IComboBoxOption } from '@fluentui/react'
import type { Cause, FlatCausalFactor, Handler } from '@showwhy/types'
import { BeliefDegree } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnChangeCauses(
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: (id: string, value: Cause) => void,
): (id: string, checked: boolean) => void {
	return useCallback(
		(id: string, checked: boolean) => {
			const newValue =
				(flatFactorsList.find(x => x.id === id) as Cause) || ({} as Cause)
			newValue.causes = checked
			if (checked && !newValue.degree) {
				newValue.degree = BeliefDegree.Strong
			} else if (!checked) {
				newValue.degree = null
			}
			saveNewFactors(id, newValue)
		},
		[flatFactorsList, saveNewFactors],
	)
}

export function useOnChangeDegree(
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: (id: string, value: Cause) => void,
): (id: string, selected: IComboBoxOption) => void {
	return useCallback(
		(id: string, selected: IComboBoxOption) => {
			const newValue = flatFactorsList.find(x => x.id === id) as Cause
			newValue.degree = selected.key as BeliefDegree
			newValue.causes = true
			saveNewFactors(id, newValue)
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
