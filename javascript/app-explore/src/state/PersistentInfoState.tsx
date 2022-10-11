/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { AtomEffect, RecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { DefaultValue, selector } from 'recoil'

let persistedInfoKeys: RecoilState<any>[] = []

export const PersistedInfoState = selector<object>({
	key: 'PersistedInfoState',
	get({ get }) {
		return persistedInfoKeys.reduce(
			(persistedInfoMap, currentKeyAtom) => ({
				...persistedInfoMap,
				[currentKeyAtom.key]: get(currentKeyAtom),
			}),
			{},
		)
	},
	set({ set, reset }, newValue) {
		if (newValue instanceof DefaultValue) {
			persistedInfoKeys.forEach(key => reset(key))
			return
		}

		for (const [key, value] of Object.entries(newValue)) {
			const currentKey = persistedInfoKeys.find(k => k.key === key)
			if (currentKey) {
				set(currentKey, value)
			}
		}
	},
})

export const persistAtomEffect: AtomEffect<any> = ({ trigger, node }) => {
	if (trigger === 'get') {
		persistedInfoKeys = [...persistedInfoKeys, node]
	}
}

export function usePersistedInfo(): object {
	return useRecoilValue(PersistedInfoState)
}

export function useSetPersistedInfo(): (newValue: object) => void {
	return useSetRecoilState(PersistedInfoState)
}