/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IDropdownOption } from '@fluentui/react'
import { Dropdown } from '@fluentui/react'
import type { FC } from 'react'
import { memo } from 'react'

import { BeliefDegree } from '../types/causality/BeliefDegree.js'
import type { CausalFactorType } from '../types/causality/CausalFactorType.js'

const beliefOptions: IDropdownOption[] = [
	{ key: BeliefDegree.None, text: 'No' },
	{ key: BeliefDegree.Weak, text: 'Weakly' },
	{ key: BeliefDegree.Moderate, text: 'Moderately' },
	{ key: BeliefDegree.Strong, text: 'Strongly' },
]
interface Props {
	onChangeDegree: (
		value: IDropdownOption,
		type: CausalFactorType,
		id?: string,
	) => void
	degree: number
	type: CausalFactorType
	id?: string
}
export const DegreeDropdown: FC<Props> = memo(function DegreeDropdown({
	onChangeDegree,
	degree,
	type,
	id,
}) {
	return (
		<Dropdown
			selectedKey={degree}
			onChange={(_, value) => value && onChangeDegree(value, type, id)}
			options={beliefOptions}
			data-pw={type}
		/>
	)
})
