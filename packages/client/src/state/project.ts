/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	atom,
	SetterOrUpdater,
	useRecoilValue,
	useSetRecoilState,
} from 'recoil'
import { stepsList } from '../data/stepsList'
import { Workflow } from '~types'

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
