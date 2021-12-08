/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IComboBoxOption } from '@fluentui/react'
import { useCallback } from 'react'
import { BeliefDegree } from '~enums'
import { Cause, FlatCausalFactor } from '~interfaces'
import { GenericFn } from '~types'

export const useOnChangeCauses = (
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: GenericFn,
): GenericFn => {
	return useCallback(
		(id: string, checked: boolean) => {
			const newValue = flatFactorsList.find(x => x.id === id) as Cause
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

export const useOnChangeDegree = (
	flatFactorsList: FlatCausalFactor[],
	saveNewFactors: GenericFn,
): GenericFn => {
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

export const useOnChangeReasoning = (
	flatFactorsList: FlatCausalFactor[],
	toggleMultiline: GenericFn,
	saveNewFactors: GenericFn,
	multiline: boolean,
): GenericFn => {
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
