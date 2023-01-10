/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const OutcomeNameState = atom<string>({
	key: 'OutcomeNameState',
	default: '',
})

export function useOutcomeNameValueState(): string {
	return useRecoilValue(OutcomeNameState)
}

export function useSetOutcomeNameState(): SetterOrUpdater<string> {
	return useSetRecoilState(OutcomeNameState)
}

export function useOutcomeNameState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(OutcomeNameState)
}
