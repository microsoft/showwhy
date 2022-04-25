/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Workflow } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import { stepsList } from '../data/stepsList'

export const selectedProject = atom<Workflow>({
	key: 'hovered-node',
	default: { name: 'Project name goes here', key: '', steps: stepsList },
})

export function useSelectedProject(): Workflow {
	return useRecoilValue(selectedProject)
}

export function useSetSelectedProject(): SetterOrUpdater<Workflow> {
	return useSetRecoilState(selectedProject)
}

export function useResetSelectedProject(): Resetter {
	return useResetRecoilState(selectedProject)
}
