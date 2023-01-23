/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ISpinButtonProps } from '@fluentui/react'

const DEFAULT_MAX_ITER = 100

export const defaultNotearsSpinningOptions = [
	{
		label: 'Max iter',
		inputProps: { name: 'max_iter' },
		defaultValue: DEFAULT_MAX_ITER.toString(),
		step: 10,
		min: 10,
		max: 2000,
	},
] as ISpinButtonProps[]
