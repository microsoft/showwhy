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

export const AggregateEnabledState = atom<boolean>({
	key: 'aggregateEnabledState',
	default: false,
})

export function useAggregateEnabledValueState(): boolean {
	return useRecoilValue(AggregateEnabledState)
}

export function useSetAggregateEnabledState(): SetterOrUpdater<boolean> {
	return useSetRecoilState(AggregateEnabledState)
}

export function useAggregateEnabledState(): [
	boolean,
	SetterOrUpdater<boolean>,
] {
	return useRecoilState(AggregateEnabledState)
}

export function useAggregateEnabledResetState(): Resetter {
	return useResetRecoilState(AggregateEnabledState)
}
