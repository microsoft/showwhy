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
import type { Workspace } from '~types'

const configJsonState = atom<Partial<Workspace>>({
	key: 'config-json-store',
	default: {},
})

export function useConfigJson(): Partial<Workspace> {
	return useRecoilValue(configJsonState)
}

export function useSetConfigJson(): SetterOrUpdater<Partial<Workspace>> {
	return useSetRecoilState(configJsonState)
}

export function useResetConfigJson(): Resetter {
	return useResetRecoilState(configJsonState)
}
