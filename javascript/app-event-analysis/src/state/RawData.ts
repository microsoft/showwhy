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

import type { Record } from '../utils/csv'

export const RawDataState = atom<Record[]>({
	key: 'RawDataState',
	default: [],
})

export function useRawDataValueState(): Record[] {
	return useRecoilValue(RawDataState)
}

export function useSetRawDataState(): SetterOrUpdater<Record[]> {
	return useSetRecoilState(RawDataState)
}

export function useRawDataState(): [Record[], SetterOrUpdater<Record[]>] {
	return useRecoilState(RawDataState)
}

export function useRawDataResetState(): Resetter {
	return useResetRecoilState(RawDataState)
}
