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
import { Project } from '~interfaces'

export const selectedProject = atom<Project>({
	key: 'hovered-node',
	default: { name: 'Project name goes here', key: '', steps: stepsList },
})

export function useSelectedProject(): Project {
	return useRecoilValue(selectedProject)
}

export function useSetSelectedProject(): SetterOrUpdater<Project> {
	return useSetRecoilState(selectedProject)
}
