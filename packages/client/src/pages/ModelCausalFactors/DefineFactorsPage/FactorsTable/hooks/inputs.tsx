/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox, ComboBox, IComboBoxOption, TextField } from '@fluentui/react'
import { useCallback } from 'react'
import { BeliefDegree } from '~enums'
import { FlatCausalFactor } from '~interfaces'
import { GenericFn } from '~types'

const beliefOptions: IComboBoxOption[] = [
	{ key: BeliefDegree.Strong, text: 'Strong' },
	{ key: BeliefDegree.Moderate, text: 'Moderate' },
	{ key: BeliefDegree.Weak, text: 'Weak' },
]

export const useCheckbox = (
	onChangeCauses: GenericFn,
): ((factor: FlatCausalFactor) => JSX.Element) => {
	return useCallback(
		(factor: FlatCausalFactor) => {
			return (
				<Checkbox
					onChange={(_, checked) => onChangeCauses(factor.id, !!checked)}
					checked={factor.causes}
					styles={{
						root: { display: 'flex', justifyContent: 'center' },
					}}
				/>
			)
		},
		[onChangeCauses],
	)
}

export const useComboBox = (
	onChangeDegree: GenericFn,
): ((factor: FlatCausalFactor) => JSX.Element) => {
	return useCallback(
		(factor: FlatCausalFactor) => {
			return (
				<ComboBox
					selectedKey={factor.degree}
					onChange={(_, value) => value && onChangeDegree(factor.id, value)}
					options={beliefOptions}
				/>
			)
		},
		[onChangeDegree],
	)
}

export const useTextField = (
	onChangeReasoning: GenericFn,
): ((factor: FlatCausalFactor) => JSX.Element) => {
	return useCallback(
		(factor: FlatCausalFactor) => {
			return (
				<TextField
					value={factor.reasoning}
					onChange={(_, val) => onChangeReasoning(factor.id, val || '')}
					multiline={factor.reasoning.length > 30}
					resizable={false}
				/>
			)
		},
		[onChangeReasoning],
	)
}
