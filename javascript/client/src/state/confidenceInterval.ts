/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const confidenceIntervalState = atom<boolean>({
	key: 'confidence-interval',
	default: false,
})

export function useConfidenceInterval(): boolean {
	return useRecoilValue(confidenceIntervalState)
}

export function useSetConfidenceInterval(): SetterOrUpdater<boolean> {
	return useSetRecoilState(confidenceIntervalState)
}

export function useResetConfidenceInterval(): Resetter {
	return useResetRecoilState(confidenceIntervalState)
}
