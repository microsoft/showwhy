/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const specCountState = atom<number | undefined>({
	key: 'spec-count-state',
	default: undefined,
})

export function useSpecCount(): number | undefined {
	return useRecoilValue(specCountState)
}

export function useSetSpecCount(): SetterOrUpdater<number | undefined> {
	return useSetRecoilState(specCountState)
}

export function useResetSpecCount(): Resetter {
	return useResetRecoilState(specCountState)
}
