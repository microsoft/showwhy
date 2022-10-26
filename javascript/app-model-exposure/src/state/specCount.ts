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

import type { Maybe } from '../types/primitives.js'
import type { SpecificationCount } from './../types/api/SpecificationCount.js'

export const specCountState = atom<Maybe<SpecificationCount>>({
	key: 'spec-count-state',
	default: undefined,
})

export function useSpecCount(): Maybe<SpecificationCount> {
	return useRecoilValue(specCountState)
}

export function useSetSpecCount(): SetterOrUpdater<Maybe<SpecificationCount>> {
	return useSetRecoilState(specCountState)
}

export function useResetSpecCount(): Resetter {
	return useResetRecoilState(specCountState)
}
