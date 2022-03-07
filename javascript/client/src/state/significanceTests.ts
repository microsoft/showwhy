/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe, SignificanceTest } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'
import { atomFamily, useRecoilValue, useSetRecoilState } from 'recoil'

export const significanceTestsState = atomFamily<
	Maybe<SignificanceTest>,
	Maybe<string>
>({
	key: 'significance-tests-store',
	default: undefined,
})

export function useSetSignificanceTests(
	key: Maybe<string>,
): SetterOrUpdater<Maybe<SignificanceTest>> {
	return useSetRecoilState(significanceTestsState(key))
}

export function useSignificanceTests(
	key: Maybe<string>,
): Maybe<SignificanceTest> {
	return useRecoilValue(significanceTestsState(key))
}
