/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DefaultDatasetResult } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

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
