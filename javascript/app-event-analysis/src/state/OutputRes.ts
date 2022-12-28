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

import type { SDIDOutputResponse } from '../types.js'

export const OutputResState = atom<SDIDOutputResponse | null>({
	key: 'OutputResState',
	default: null,
})

export function useOutputResValueState(): SDIDOutputResponse | null {
	return useRecoilValue(OutputResState)
}

export function useSetOutputResState(): SetterOrUpdater<SDIDOutputResponse | null> {
	return useSetRecoilState(OutputResState)
}

export function useOutputResState(): [
	SDIDOutputResponse | null,
	SetterOrUpdater<SDIDOutputResponse | null>,
] {
	return useRecoilState(OutputResState)
}

export function useOutputResResetState(): Resetter {
	return useResetRecoilState(OutputResState)
}
