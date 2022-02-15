/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, useRecoilValue, useRecoilState, SetterOrUpdater } from 'recoil'

const SHOW_GUIDANCE_LS_KEY = 'showwhy:show_guidance'

function defaultShowGuidance(): boolean {
	const found = localStorage.getItem(SHOW_GUIDANCE_LS_KEY)
	if (found != null) {
		try {
			return JSON.parse(found)
		} catch (err: unknown) {}
	}
	return true
}

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: defaultShowGuidance(),
	effects: [
		({ onSet }) => {
			onSet(newVal => {
				localStorage.setItem(SHOW_GUIDANCE_LS_KEY, JSON.stringify(newVal))
			})
		},
	],
})

export function useGuidanceState(): [boolean, SetterOrUpdater<boolean>] {
	return useRecoilState(guidanceState)
}

export function useGuidance(): boolean {
	return useRecoilValue(guidanceState)
}
