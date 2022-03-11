/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import type { ProjectFile } from '~types'

import { filesState, filesStateChanged } from './files'

const selectedFileState = atom<Maybe<ProjectFile>>({
	key: 'selected-file',
	default: undefined,
	dangerouslyAllowMutability: true,
	effects: [
		({ setSelf, getPromise }) => {
			/* eslint-disable-next-line @typescript-eslint/no-misused-promises */
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
