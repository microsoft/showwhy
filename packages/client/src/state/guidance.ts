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

export const guidanceState = atom<boolean>({
	key: 'guidance',
	default: true,
})

export function useGuidance(): boolean {
	return useRecoilValue(guidanceState)
}

export function useSetGuidance(): SetterOrUpdater<boolean> {
	return useSetRecoilState(guidanceState)
}
