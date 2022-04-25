/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SignificanceTest } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const significanceTestState = atom<SignificanceTest[]>({
	key: 'significance-test-store',
	default: [],
})

export function useSetSignificanceTest(): SetterOrUpdater<SignificanceTest[]> {
	return useSetRecoilState(significanceTestState)
}

export function useSignificanceTest(): SignificanceTest[] {
	return useRecoilValue(significanceTestState)
}

export function useResetSignificanceTest(): Resetter {
	return useResetRecoilState(significanceTestState)
}
