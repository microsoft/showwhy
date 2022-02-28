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
import type { Experiment } from '@showwhy/types'

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
