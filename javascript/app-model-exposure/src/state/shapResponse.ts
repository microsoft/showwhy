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

import type { ShapStatus } from '../types/api/ShapStatus.js'

export const shapResponseState = atom<ShapStatus[]>({
	key: 'shap-response-store',
	default: [],
})

export function useSetShapResponse(): SetterOrUpdater<ShapStatus[]> {
	return useSetRecoilState(shapResponseState)
}

export function useShapResponse(): ShapStatus[] {
	return useRecoilValue(shapResponseState)
}

export function useResetShapResponse(): Resetter {
	return useResetRecoilState(shapResponseState)
}
