/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'

import type { ToggleCallback } from '~hooks'
import { useRecoilBasedToggle } from '~hooks'

import { localStorageEffect } from './effects/localStorageEffect'

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: true,
	effects: [localStorageEffect('showwhy:show_guidance')],
})

export function useGuidance(): [boolean, ToggleCallback] {
	return useRecoilBasedToggle(guidanceState)
}
