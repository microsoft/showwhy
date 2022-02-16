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
import { filesState, filesStateChanged } from './files'
import { ProjectFile, Maybe } from '~types'

const selectedFileState = atom<Maybe<ProjectFile>>({
	key: 'selected-file',
	default: undefined,
	effects: [
		({ setSelf, getPromise }) => {
			const subscription = filesStateChanged.subscribe(async () => {
				const files = await getPromise(filesState)
				setSelf(files[0])
			})
			return () => subscription.unsubscribe()
		},
	],
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
