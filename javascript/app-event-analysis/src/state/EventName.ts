/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const EventNameState = atom<string>({
	key: 'EventNameState',
	default: 'treatment/event',
})

export function useEventNameValueState(): string {
	return useRecoilValue(EventNameState)
}

export function useSetEventNameState(): SetterOrUpdater<string> {
	return useSetRecoilState(EventNameState)
}

export function useEventNameState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(EventNameState)
}
