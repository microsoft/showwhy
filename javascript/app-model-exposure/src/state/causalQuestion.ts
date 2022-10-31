/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Resetter, SetterOrUpdater } from 'recoil'
import { Hypothesis } from '@showwhy/app-common'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

import type { CausalQuestion } from '../types/question/CausalQuestion.js'

const causalQuestionState = atom<CausalQuestion>({
	key: 'causal-question',
	default: {
		hypothesis: Hypothesis.Change,
	} as CausalQuestion,
})

export function useCausalQuestion(): CausalQuestion {
	return useRecoilValue(causalQuestionState)
}

export function useSetCausalQuestion(): SetterOrUpdater<CausalQuestion> {
	return useSetRecoilState(causalQuestionState)
}

export function useResetCausalQuestion(): Resetter {
	return useResetRecoilState(causalQuestionState)
}
