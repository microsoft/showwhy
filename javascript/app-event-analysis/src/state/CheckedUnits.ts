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

export const CheckedUnitsState = atom<Set<string> | null>({
	key: 'CheckedUnitsState',
	default: null,
})

export function useCheckedUnitsValueState(): Set<string> | null {
	return useRecoilValue(CheckedUnitsState)
}

export function useSetCheckedUnitsState(): SetterOrUpdater<Set<string> | null> {
	return useSetRecoilState(CheckedUnitsState)
}

export function useCheckedUnitsState(): [
	Set<string> | null,
	SetterOrUpdater<Set<string> | null>,
] {
	return useRecoilState(CheckedUnitsState)
}

export function useCheckedUnitsResetState(): Resetter {
	return useResetRecoilState(CheckedUnitsState)
}
