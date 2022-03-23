/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { ComboBox } from '@fluentui/react'
import { BeliefDegree } from '@showwhy/types'
import { useCallback } from 'react'

const beliefOptions: IComboBoxOption[] = [
	{ key: BeliefDegree.Strong, text: 'Strong' },
	{ key: BeliefDegree.Moderate, text: 'Moderate' },
	{ key: BeliefDegree.Weak, text: 'Weak' },
]

export function useDegreeComboBox(
	onChangeDegree: (value: IComboBoxOption, id?: string) => void,
): (degree: number, id?: string) => JSX.Element {
	return useCallback(
		(degree: number, id?: string) => {
			return (
				<ComboBox
					selectedKey={degree}
					onChange={(_, value) => value && onChangeDegree(value, id)}
					options={beliefOptions}
				/>
			)
		},
		[onChangeDegree],
	)
}
