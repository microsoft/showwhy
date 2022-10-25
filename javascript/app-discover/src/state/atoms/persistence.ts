/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { recoilPersist } from 'recoil-persist'

import { persistAtomEffect } from '../persistence.js'

const { persistAtom } = recoilPersist()

const isDev = window.location.search.endsWith('dev')

export const persistence = isDev ? {
	effects_UNSTABLE: [persistAtomEffect, persistAtom],
} : {}
