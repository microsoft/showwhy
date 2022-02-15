/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, useRecoilValue, useRecoilState, SetterOrUpdater } from 'recoil'
import { localStorageEffect } from './effects/localStorageEffect'

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: true,
	effects: [localStorageEffect('showwhy:show_guidance')],
})

export function useGuidanceState(): [boolean, SetterOrUpdater<boolean>] {
	return useRecoilState(guidanceState)
}

export function useGuidance(): boolean {
	return useRecoilValue(guidanceState)
}
