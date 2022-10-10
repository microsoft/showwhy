/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { type IChoiceGroupOption, type IChoiceGroupStyles, ChoiceGroup } from '@fluentui/react'
import type { FC, FormEvent } from 'react'
import { memo } from 'react'

import { Container } from './HypothesisGroup.styles.js'
import { Hypothesis } from './HypothesisGroup.types.js'

export const HypothesisGroup: FC<{
	hypothesis?: Hypothesis
	onChange: (
		ev?: FormEvent<HTMLElement | HTMLInputElement> | undefined,
		option?: IChoiceGroupOption | undefined,
	) => void
	styles?: IChoiceGroupStyles
}> = memo(function HypothesisGroup({ hypothesis, onChange, styles = {} }) {
	return (
		<Container>
			<ChoiceGroup
				selectedKey={hypothesis ?? null}
				onChange={onChange}
				options={options}
				styles={styles}
			/>
		</Container>
	)
})

const options: IChoiceGroupOption[] = [
	{
		key: Hypothesis.Change,
		text: Hypothesis.Change,
	},
	{
		key: Hypothesis.Increase,
		text: Hypothesis.Increase,
	},
	{
		key: Hypothesis.Decrease,
		text: Hypothesis.Decrease,
	},
]
