/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Experiment } from '@showwhy/types'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const experimentState = atom<Experiment>({
	key: 'describe-elements',
	default: {} as Experiment,
})

export function useExperiment(): Experiment {
	return useRecoilValue(experimentState)
}

export function useSetExperiment(): SetterOrUpdater<Experiment> {
	return useSetRecoilState(experimentState)
}

export function useResetExperiment(): Resetter {
	return useResetRecoilState(experimentState)
}
