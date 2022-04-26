/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IComboBoxOption } from '@fluentui/react'
import { ComboBox } from '@fluentui/react'
import type { CausalFactorType } from '@showwhy/types'
import { BeliefDegree } from '@showwhy/types'
import type { FC } from 'react'
import { memo } from 'react'

const beliefOptions: IComboBoxOption[] = [
	{ key: BeliefDegree.None, text: 'No' },
	{ key: BeliefDegree.Weak, text: 'Weakly' },
	{ key: BeliefDegree.Moderate, text: 'Moderately' },
	{ key: BeliefDegree.Strong, text: 'Strongly' },
]
interface Props {
	onChangeDegree: (
		value: IComboBoxOption,
		type: CausalFactorType,
		id?: string,
	) => void
	degree: number
	type: CausalFactorType
	id?: string
}
export const DegreeComboBox: FC<Props> = memo(function DegreeComboBox({
	onChangeDegree,
	degree,
	type,
	id,
}) {
	return (
		<ComboBox
			selectedKey={degree}
			onChange={(_, value) => value && onChangeDegree(value, type, id)}
			options={beliefOptions}
			data-pw={type}
		/>
	)
})
