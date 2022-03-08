/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { Subject } from 'rxjs'

import type { ProjectFile } from '~types'

import { observableEffect } from './effects/observableEffect'

export const filesStateChanged = new Subject<void>()

export const filesState = atom<ProjectFile[]>({
	key: 'files',
	default: [],
	dangerouslyAllowMutability: true,
	effects: [observableEffect(filesStateChanged)],
})

export function useProjectFiles(): ProjectFile[] {
	return useRecoilValue(filesState)
}

/**
 * Returned callback allows the addition of new files to the project list.
 * @returns
 */
export function useAddProjectFile(): (file: ProjectFile) => void {
	const setFiles = useSetRecoilState(filesState)
	return useCallback(
		(file: ProjectFile) => {
			setFiles(prev => [...prev, file])
		},
		[setFiles],
	)
}

export function useRemoveProjectFile(): (fileId: string) => void {
	const setFiles = useSetRecoilState(filesState)
	return useCallback(
		(fileId: string) => {
			setFiles(prev => prev.filter(f => f.id !== fileId))
		},
		[setFiles],
	)
}

export function useSetProjectFiles(): SetterOrUpdater<ProjectFile[]> {
	return useSetRecoilState(filesState)
}

export function useResetProjectFiles(): Resetter {
	return useResetRecoilState(filesState)
}
