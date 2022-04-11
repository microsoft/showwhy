/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { ComboBox } from '@fluentui/react'
import type { CausalFactorType } from '@showwhy/types'
import { BeliefDegree } from '@showwhy/types'
import { useCallback } from 'react'

const beliefOptions: IComboBoxOption[] = [
	{ key: BeliefDegree.None, text: 'No' },
	{ key: BeliefDegree.Weak, text: 'Weakly' },
	{ key: BeliefDegree.Moderate, text: 'Moderately' },
	{ key: BeliefDegree.Strong, text: 'Strongly' },
]

export function useDegreeComboBox(
	onChangeDegree: (
		value: IComboBoxOption,
		type: CausalFactorType,
		id?: string,
	) => void,
): (degree: number, type: CausalFactorType, id?: string) => JSX.Element {
	return useCallback(
		(degree: number, type: CausalFactorType, id?: string) => {
			return (
				<ComboBox
					selectedKey={degree}
					onChange={(_, value) => value && onChangeDegree(value, type, id)}
					options={beliefOptions}
					data-pw={type}
				/>
			)
		},
		[onChangeDegree],
	)
}
