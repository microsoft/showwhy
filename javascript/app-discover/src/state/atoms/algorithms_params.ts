/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { atom } from 'recoil'

import type { NotearsAlgorithmParams } from '../../domain/Algorithms/Notears.js'
import type { PCAlgorithmParams } from '../../domain/Algorithms/PC.js'
import type { DECIAlgorithmParams } from './../../domain/Algorithms/DECI.js'

export const DeciParamsState = atom<DECIAlgorithmParams>({
	key: 'DeciParamsState',
	default: { model_options: {}, ate_options: {}, training_options: {} },
})

export const NotearsParamsState = atom<NotearsAlgorithmParams>({
	key: 'NotearsParamsState',
	default: {},
})

export const PCParamsState = atom<PCAlgorithmParams>({
	key: 'PCParamsState',
	default: {},
})
