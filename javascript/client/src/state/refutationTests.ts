/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RefutationType } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

export const RefutationTypeState = atom<RefutationType>({
	key: 'refutation-tests',
	default: RefutationType.QuickRefutation,
})

export function useRefutationType(): RefutationType {
	return useRecoilValue(RefutationTypeState)
}

export function useSetRefutationType(): SetterOrUpdater<RefutationType> {
	return useSetRecoilState(RefutationTypeState)
}

export function useResetRefutationType(): Resetter {
	return useResetRecoilState(RefutationTypeState)
}
