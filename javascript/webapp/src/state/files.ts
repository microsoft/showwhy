/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ProjectFile } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { Subject } from 'rxjs'

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

export function useSetProjectFiles(): SetterOrUpdater<ProjectFile[]> {
	return useSetRecoilState(filesState)
}

export function useResetProjectFiles(): Resetter {
	return useResetRecoilState(filesState)
}
