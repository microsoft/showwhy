/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import { CONFIGURATION_TABS } from '../types.js'

export const SelectedTabKeyState = atom<string>({
	key: 'SelectedTabKeyState',
	default: CONFIGURATION_TABS.prepareAnalysis.key,
})
