/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ISpinButtonProps } from '@fluentui/react'

const DEFAULT_MAX_STEPS_AUGLAG = 20
const DEFAULT_MAX_AUGLAG_INNER_EPOCHS = 1000

export const defaultTrainingSpinningOptions = [
	{
		label: 'Max steps auglag',
		inputProps: { name: 'max_steps_auglag' },
		defaultValue: DEFAULT_MAX_STEPS_AUGLAG.toString(),
		step: 10,
		min: 10,
		max: 250,
	},
	{
		label: 'Max auglag inner epochs',
		inputProps: { name: 'max_auglag_inner_epochs' },
		defaultValue: DEFAULT_MAX_AUGLAG_INNER_EPOCHS.toString(),
		step: 100,
		min: 100,
		max: 5000,
	},
] as ISpinButtonProps[]
