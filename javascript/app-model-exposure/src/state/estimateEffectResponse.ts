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

import type { EstimateEffectStatus } from '../types/api/EstimateEffectStatus.js'

export const estimateEffectResponseState = atom<EstimateEffectStatus[]>({
	key: 'estimate-effect-response-store',
	default: [],
})

export function useSetEstimateEffectResponse(): SetterOrUpdater<
	EstimateEffectStatus[]
> {
	return useSetRecoilState(estimateEffectResponseState)
}

export function useEstimateEffectResponse(): EstimateEffectStatus[] {
	return useRecoilValue(estimateEffectResponseState)
}

export function useResetEstimateEffectResponse(): Resetter {
	return useResetRecoilState(estimateEffectResponseState)
}
