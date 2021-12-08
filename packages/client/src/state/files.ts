/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { ProjectFile } from '~interfaces'

const filesState = atom<ProjectFile[]>({
	key: 'files',
	default: [],
	dangerouslyAllowMutability: true,
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

const selectedFileState = atom<ProjectFile | undefined>({
	key: 'selected-file',
	default: undefined,
})

export function useSelectedFile(): ProjectFile | undefined {
	return useRecoilValue(selectedFileState)
}

export function useSetSelectedFile(): SetterOrUpdater<ProjectFile | undefined> {
	return useSetRecoilState(selectedFileState)
}

export function useResetSelectedFile(): Resetter {
	return useResetRecoilState(selectedFileState)
}
