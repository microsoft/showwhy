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

const projectNameState = atom<string>({
	key: 'projectName',
	default: 'Exposure Analysis',
})

export function useProjectName(): string {
	return useRecoilValue(projectNameState)
}

export function useSetProjectName(): SetterOrUpdater<string> {
	return useSetRecoilState(projectNameState)
}

export function useResetProjectName(): Resetter {
	return useResetRecoilState(projectNameState)
}
