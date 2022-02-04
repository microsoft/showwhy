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
import { ProjectFile, Maybe } from '~types'

const selectedFileState = atom<Maybe<ProjectFile>>({
	key: 'selected-file',
	default: undefined,
	dangerouslyAllowMutability: true,
})

export function useSelectedFile(): Maybe<ProjectFile> {
	return useRecoilValue(selectedFileState)
}

export function useSetSelectedFile(): SetterOrUpdater<Maybe<ProjectFile>> {
	return useSetRecoilState(selectedFileState)
}

export function useResetSelectedFile(): Resetter {
	return useResetRecoilState(selectedFileState)
}
