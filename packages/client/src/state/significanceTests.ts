/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atomFamily,
	SetterOrUpdater,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { SignificanceTest } from '~types'

export const significanceTestsState = atomFamily<
	SignificanceTest | undefined,
	string | undefined
>({
	key: 'significance-tests-store',
	default: undefined,
})

export function useSetSignificanceTests(
	key: string | undefined,
): SetterOrUpdater<SignificanceTest | undefined> {
	return useSetRecoilState(significanceTestsState(key))
}

export function useSignificanceTests(
	key: string | undefined,
): SignificanceTest | undefined {
	return useRecoilValue(significanceTestsState(key))
}
