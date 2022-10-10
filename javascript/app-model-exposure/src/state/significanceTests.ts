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

import type { SignificanceTestStatus } from '../types/api/SignificanceTestStatus.js'

export const significanceTestState = atom<SignificanceTestStatus[]>({
	key: 'significance-test-store',
	default: [],
})

export function useSetSignificanceTest(): SetterOrUpdater<
	SignificanceTestStatus[]
> {
	return useSetRecoilState(significanceTestState)
}

export function useSignificanceTest(): SignificanceTestStatus[] {
	return useRecoilValue(significanceTestState)
}

export function useResetSignificanceTest(): Resetter {
	return useResetRecoilState(significanceTestState)
}
