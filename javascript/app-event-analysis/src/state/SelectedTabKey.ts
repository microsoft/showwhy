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

import { CONFIGURATION_TABS } from '../types.js'

export const SelectedTabKeyState = atom<string>({
	key: 'SelectedTabKeyState',
	default: CONFIGURATION_TABS.prepareAnalysis.key,
})

export function useSelectedTabKeyValueState(): string {
	return useRecoilValue(SelectedTabKeyState)
}

export function useSetSelectedTabKeyState(): SetterOrUpdater<string> {
	return useSetRecoilState(SelectedTabKeyState)
}

export function useSelectedTabKeyState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(SelectedTabKeyState)
}

export function useSelectedTabKeyResetState(): Resetter {
	return useResetRecoilState(SelectedTabKeyState)
}
