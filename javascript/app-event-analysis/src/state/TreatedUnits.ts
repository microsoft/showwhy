/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilState,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const TreatedUnitsState = atom<string[]>({
	key: 'TreatedUnitState',
	default: [],
})

export function useTreatedUnitsValueState(): string[] {
	return useRecoilValue(TreatedUnitsState)
}

export function useSetTreatedUnitsState(): SetterOrUpdater<string[]> {
	return useSetRecoilState(TreatedUnitsState)
}

export function useTreatedUnitsState(): [string[], SetterOrUpdater<string[]>] {
	return useRecoilState(TreatedUnitsState)
}

export function useTreatedUnitsResetState(): Resetter {
	return useResetRecoilState(TreatedUnitsState)
}
