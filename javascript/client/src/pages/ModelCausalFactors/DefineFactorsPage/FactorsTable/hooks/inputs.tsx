/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Checkbox, TextField } from '@fluentui/react'
import type { FlatCausalFactor } from '@showwhy/types'
import { useCallback } from 'react'

export function useCheckbox(
	onChangeCauses: (factorId: string, checked: boolean) => void,
): (factor: FlatCausalFactor) => JSX.Element {
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

export function useTextField(
	onChangeReasoning: (factorId: string, value: string) => void,
): (factor: FlatCausalFactor) => JSX.Element {
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
