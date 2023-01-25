/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { IChoiceGroupOption, ISpinButtonProps } from '@fluentui/react'
import { upperFirst } from 'lodash'

import { PCCITest, PCVariant } from '../domain/Algorithms/PC.js'

const DEFAULT_ALPHA = 0.05

export const DEFAULT_VARIANT = PCVariant.Original
export const DEFAULT_CI_TEST = PCCITest.Gauss

export const defaultPCSpinningOptions = [
	{
		label: 'Alpha',
		inputProps: { name: 'alpha' },
		defaultValue: DEFAULT_ALPHA.toString(),
		step: 0.01,
		min: 0.01,
		max: 1.0,
	},
] as ISpinButtonProps[]

export const variantChoiceOptions: IChoiceGroupOption[] = [
	{
		key: PCVariant.Original,
		text: upperFirst(PCVariant.Original),
	},
	{
		key: PCVariant.Stable,
		text: upperFirst(PCVariant.Stable),
	},
]

export const ciTestChoiceOptions: IChoiceGroupOption[] = [
	{
		key: PCCITest.Gauss,
		text: upperFirst(PCCITest.Gauss),
	},
	{
		key: PCCITest.G2,
		text: upperFirst(PCCITest.G2),
	},
	{
		key: PCCITest.Chi2,
		text: upperFirst(PCCITest.Chi2),
	},
]
