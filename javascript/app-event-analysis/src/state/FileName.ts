/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const FileNameState = atom<string>({
	key: 'FileNameState',
	default: '',
})

export function useFileNameValueState(): string {
	return useRecoilValue(FileNameState)
}

export function useSetFileNameState(): SetterOrUpdater<string> {
	return useSetRecoilState(FileNameState)
}

export function useFileNameState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(FileNameState)
}
