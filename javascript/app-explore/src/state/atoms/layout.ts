/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'
import { recoilPersist } from 'recoil-persist'

import type { NodePosition } from '../../domain/NodePosition.js'
import { persistAtomEffect } from '../persistence.js'

const { persistAtom } = recoilPersist()

export const NodePositionsState = atom<{ [key: string]: NodePosition }>({
	key: 'NodePositionState',
	default: {},
	// eslint-disable-next-line camelcase
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
})
