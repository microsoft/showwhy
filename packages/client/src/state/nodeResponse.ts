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
import { NodeResponse } from '~interfaces'

export const nodeResponseState = atom<NodeResponse | undefined>({
	key: 'node-response-store',
	default: undefined,
})

export function useSetNodeResponse(): SetterOrUpdater<
	NodeResponse | undefined
> {
	return useSetRecoilState(nodeResponseState)
}

export function useNodeResponse(): NodeResponse | undefined {
	return useRecoilValue(nodeResponseState)
}
