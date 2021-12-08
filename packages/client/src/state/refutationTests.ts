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
import { RefutationTypes } from '~enums'

export const RefutationTypeState = atom<RefutationTypes>({
	key: 'refutation-tests',
	default: RefutationTypes.QuickRefutation,
})

export function useRefutationType(): RefutationTypes {
	return useRecoilValue(RefutationTypeState)
}

export function useSetRefutationType(): SetterOrUpdater<RefutationTypes> {
	return useSetRecoilState(RefutationTypeState)
}

export function useResetRefutationType(): Resetter {
	return useResetRecoilState(RefutationTypeState)
}
