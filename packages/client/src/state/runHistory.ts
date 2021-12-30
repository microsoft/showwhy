/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import {
	NodeResponse,
	PartialResults,
	RunHistory,
	RunStatus,
} from '~interfaces'

export const runHistoryState = atom<RunHistory[]>({
	key: 'run-history-store',
	default: [],
})

export const nodeResponseState = atom<NodeResponse | undefined>({
	key: 'node-response-store',
	default: undefined,
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

export function useSetNodeResponse(): SetterOrUpdater<
	NodeResponse | undefined
> {
	return useSetRecoilState(nodeResponseState)
}

export function useNodeResponse(): NodeResponse | undefined {
	return useRecoilValue(nodeResponseState)
}
