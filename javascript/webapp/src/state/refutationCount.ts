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

export const refutationCountState = atom<number>({
	key: 'refutation-count',
	default: 5,
})

export function useRefutationCount(): number {
	return useRecoilValue(refutationCountState)
}

export function useSetRefutationCount(): SetterOrUpdater<number> {
	return useSetRecoilState(refutationCountState)
}

export function useResetRefutationCount(): Resetter {
	return useResetRecoilState(refutationCountState)
}
