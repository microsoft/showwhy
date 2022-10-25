/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import type { NodePosition } from '../../domain/NodePosition.js'

export const NodePositionsState = atom<{ [key: string]: NodePosition }>({
	key: 'NodePositionState',
	default: {},
})
