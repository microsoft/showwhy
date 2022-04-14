/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { RunHistory } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const runHistoryState = atom<RunHistory[]>({
	key: 'run-history-store',
	default: [],
})

export function useSetRunHistory(): SetterOrUpdater<RunHistory[]> {
	return useSetRecoilState(runHistoryState)
}

export function useRunHistory(): RunHistory[] {
	return useRecoilValue(runHistoryState)
}

export function useResetRunHistory(): Resetter {
	return useResetRecoilState(runHistoryState)
}
