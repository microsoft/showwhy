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

export const PlaceboOutputResState = atom<
	Record<string, SDIDOutputResponse | null>
>({
	key: 'PlaceboOutputResState',
	default: {},
})

export function usePlaceboOutputResValueState(): Record<
	string,
	SDIDOutputResponse | null
> {
	return useRecoilValue(PlaceboOutputResState)
}

export function useSetPlaceboOutputResState(): SetterOrUpdater<
	Record<string, SDIDOutputResponse | null>
> {
	return useSetRecoilState(PlaceboOutputResState)
}

export function usePlaceboOutputResState(): [
	Record<string, SDIDOutputResponse | null>,
	SetterOrUpdater<Record<string, SDIDOutputResponse | null>>,
] {
	return useRecoilState(PlaceboOutputResState)
}

export function usePlaceboOutputResResetState(): Resetter {
	return useResetRecoilState(PlaceboOutputResState)
}
