/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const CurrentFileNameState = atom<string>({
	key: 'CurrentFileNameState',
	default: '',
})

export function useCurrentFileNameValueState(): string {
	return useRecoilValue(CurrentFileNameState)
}

export function useSetCurrentFileNameState(): SetterOrUpdater<string> {
	return useSetRecoilState(CurrentFileNameState)
}

export function useCurrentFileNameState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(CurrentFileNameState)
}
