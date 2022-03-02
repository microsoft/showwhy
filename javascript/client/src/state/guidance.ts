/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom } from 'recoil'
import { localStorageEffect } from './effects/localStorageEffect'
import { ToggleCallback, useRecoilBasedToggle } from '~hooks'

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: true,
	effects: [localStorageEffect('showwhy:show_guidance')],
})

export function useGuidance(): [boolean, ToggleCallback] {
	return useRecoilBasedToggle(guidanceState)
}
