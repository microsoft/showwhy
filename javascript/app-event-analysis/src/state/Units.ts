/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const UnitsState = atom<string>({
	key: 'UnitsState',
	default: '',
})

export function useUnitsValueState(): string {
	return useRecoilValue(UnitsState)
}

export function useSetUnitsState(): SetterOrUpdater<string> {
	return useSetRecoilState(UnitsState)
}

export function useUnitsState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(UnitsState)
}
