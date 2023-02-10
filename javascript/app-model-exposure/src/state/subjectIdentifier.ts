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

export const defaultSubjectIdentifier = 'index'

export const subjectIdentifierState = atom<string | undefined>({
	key: 'subject-identifier',
	default: defaultSubjectIdentifier,
})

export function useSubjectIdentifier(): string | undefined {
	return useRecoilValue(subjectIdentifierState)
}

export function useSetSubjectIdentifier(): SetterOrUpdater<string | undefined> {
	return useSetRecoilState(subjectIdentifierState)
}

export function useResetSubjectIdentifier(): Resetter {
	return useResetRecoilState(subjectIdentifierState)
}
