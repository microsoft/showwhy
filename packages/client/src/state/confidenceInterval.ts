/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
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

export function useToggleConfidenceInterval(): () => void {
	const set = useSetRecoilState(confidenceIntervalState)
	return useCallback(() => {
		set(prev => !prev)
	}, [set])
}

export function useResetConfidenceInterval(): Resetter {
	return useResetRecoilState(confidenceIntervalState)
}
