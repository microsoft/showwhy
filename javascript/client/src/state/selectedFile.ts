/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Maybe } from '@showwhy/types'
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState } from 'recoil'

import type { ProjectFile } from '~types'

import { filesState, filesStateChanged } from './files'

const selectedFileState = atom<Maybe<ProjectFile>>({
	key: 'selected-file',
	default: undefined,
	dangerouslyAllowMutability: true,
	effects: [
		({ setSelf, getPromise }) => {
			const subscription = filesStateChanged.subscribe(async () => {
				debugger
				const [files, actual] = await Promise.all([
					getPromise(filesState),
					getPromise(selectedFileState),
				])
				if (!files.length) setSelf(undefined)
				if (!files.find(x => x.id === actual?.id)) {
					setSelf(files[0])
				}
			})
			return () => subscription.unsubscribe()
		},
	],
})

export function useSelectedFile(): [
	Maybe<ProjectFile>,
	SetterOrUpdater<Maybe<ProjectFile>>,
] {
	return useRecoilState(selectedFileState)
}
