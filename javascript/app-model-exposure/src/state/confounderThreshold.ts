/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const confounderThresholdState = atom<number>({
	key: 'confounder-threshold',
	default: 10,
})

export function useConfounderThreshold(): number {
	return useRecoilValue(confounderThresholdState)
}

export function useSetConfounderThreshold(): SetterOrUpdater<number> {
	return useSetRecoilState(confounderThresholdState)
}

export function useResetConfounderThreshold(): Resetter {
	return useResetRecoilState(confounderThresholdState)
}
