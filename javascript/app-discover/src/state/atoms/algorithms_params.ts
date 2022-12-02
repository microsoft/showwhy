/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { atom } from 'recoil'

import type {
	DECIParams,
	DECITrainingOptions,
} from './../../domain/Algorithms/DECI.js'

const training_options = {
	max_steps_auglag: 10,
	max_auglag_inner_epochs: 100,
} as DECITrainingOptions

export const DeciParamsState = atom<DECIParams>({
	key: 'DeciParamsState',
	default: { model_options: {}, ate_options: {} },
})
