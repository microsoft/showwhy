/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'
import { Experiment } from '~types'

const defineQuestionState = atom<Experiment>({
	key: 'describe-elements',
	default: {} as Experiment,
})

export function useDefineQuestion(): Experiment {
	return useRecoilValue(defineQuestionState)
}

export function useSetDefineQuestion(): SetterOrUpdater<Experiment> {
	return useSetRecoilState(defineQuestionState)
}

export function useResetDefineQuestion(): Resetter {
	return useResetRecoilState(defineQuestionState)
}
