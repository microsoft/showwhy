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

import type { ConfidenceIntervalStatus } from '../types/api/ConfidenceIntervalStatus.js'

export const confidenceIntervalResponseState = atom<ConfidenceIntervalStatus[]>(
	{
		key: 'confidence-interval-response-store',
		default: [],
	},
)

export function useSetConfidenceIntervalResponse(): SetterOrUpdater<
	ConfidenceIntervalStatus[]
> {
	return useSetRecoilState(confidenceIntervalResponseState)
}

export function useConfidenceIntervalResponse(): ConfidenceIntervalStatus[] {
	return useRecoilValue(confidenceIntervalResponseState)
}

export function useResetConfidenceIntervalResponse(): Resetter {
	return useResetRecoilState(confidenceIntervalResponseState)
}
