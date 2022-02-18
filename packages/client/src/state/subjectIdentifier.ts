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

const subjectIdentifierState = atom<string | undefined>({
	key: 'subject-identifier',
	default: '',
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
