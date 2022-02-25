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
import { RefutationType } from '~types'

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
