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

import type { DateFilter } from '../types.js'

export const FilterState = atom<DateFilter | null>({
	key: 'FilterState',
	default: null,
})

export function useFilterValueState(): DateFilter | null {
	return useRecoilValue(FilterState)
}

export function useSetFilterState(): SetterOrUpdater<DateFilter | null> {
	return useSetRecoilState(FilterState)
}

export function useFilterState(): [
	DateFilter | null,
	SetterOrUpdater<DateFilter | null>,
] {
	return useRecoilState(FilterState)
}

export function useFilterResetState(): Resetter {
	return useResetRecoilState(FilterState)
}
