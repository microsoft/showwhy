/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const specCountState = atom<Maybe<number>>({
	key: 'spec-count-state',
	default: undefined,
})

export function useSpecCount(): Maybe<number> {
	return useRecoilValue(specCountState)
}

export function useSetSpecCount(): SetterOrUpdater<Maybe<number>> {
	return useSetRecoilState(specCountState)
}

export function useResetSpecCount(): Resetter {
	return useResetRecoilState(specCountState)
}
