/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atom,
	SetterOrUpdater,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import type { NodeResponse, Maybe } from '~types'

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
