/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import type { Intervention } from '../../domain/CausalInference.js'

export const CausalInterventionsState = atom<Intervention[]>({
	key: 'CausalInterventionsState',
	default: [],
})

export const CausalInferenceBaselineValuesState = atom<Map<string, number>>({
	key: 'CausalInferenceBaselineValuesState',
	default: new Map(),
})

export const CausalInferenceBaselineOffsetsState = atom<Map<string, number>>({
	key: 'CausalInferenceBaselineOffsetsState',
	default: new Map(),
})

export const CausalInferenceResultState = atom<Map<string, number>>({
	key: 'CausalInferenceResultState',
	default: new Map(),
})
