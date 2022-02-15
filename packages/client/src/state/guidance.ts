/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { atom, useRecoilValue, useRecoilState } from 'recoil'

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: true,
})

export function useGuidanceState() {
	return useRecoilState(guidanceState)
}

export function useGuidance(): boolean {
	return useRecoilValue(guidanceState)
}
