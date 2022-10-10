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

import type { ProjectJson } from '../types/workspace/ProjectJson.js'

const projectJsonState = atom<Partial<ProjectJson>>({
	key: 'project-json-store',
	default: {},
})

export function useProjectJson(): Partial<ProjectJson> {
	return useRecoilValue(projectJsonState)
}

export function useSetProjectJson(): SetterOrUpdater<Partial<ProjectJson>> {
	return useSetRecoilState(projectJsonState)
}

export function useResetProjectJson(): Resetter {
	return useResetRecoilState(projectJsonState)
}
