/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import type { DefaultDatasetResult } from '~types'

export const defaultDatasetResultState = atom<DefaultDatasetResult | null>({
	key: 'default-dataset-result',
	default: null,
})

export function useDefaultDatasetResult(): DefaultDatasetResult | null {
	return useRecoilValue(defaultDatasetResultState)
}

export function useSetDefaultDatasetResult(): SetterOrUpdater<DefaultDatasetResult | null> {
	return useSetRecoilState(defaultDatasetResultState)
}

export function useResetDefaultDatasetResult(): Resetter {
	return useResetRecoilState(defaultDatasetResultState)
}
