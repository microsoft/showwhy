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

import type { RefutationStatus } from '../types/api/RefutationStatus.js'

export const refutationResponseState = atom<RefutationStatus[]>({
	key: 'refutation-response-store',
	default: [],
})

export function useSetRefutationResponse(): SetterOrUpdater<
	RefutationStatus[]
> {
	return useSetRecoilState(refutationResponseState)
}

export function useRefutationResponse(): RefutationStatus[] {
	return useRecoilValue(refutationResponseState)
}

export function useResetRefutationResponse(): Resetter {
	return useResetRecoilState(refutationResponseState)
}
