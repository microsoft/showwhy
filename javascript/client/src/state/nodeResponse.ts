/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe, NodeResponse } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const nodeResponseState = atom<Maybe<NodeResponse>>({
	key: 'node-response-store',
	default: undefined,
})

export function useSetNodeResponse(): SetterOrUpdater<Maybe<NodeResponse>> {
	return useSetRecoilState(nodeResponseState)
}

export function useNodeResponse(): Maybe<NodeResponse> {
	return useRecoilValue(nodeResponseState)
}

export function useResetNodeResponse(): Resetter {
	return useResetRecoilState(nodeResponseState)
}
