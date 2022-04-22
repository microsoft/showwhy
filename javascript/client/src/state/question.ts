/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Question } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const experimentState = atom<Question>({
	key: 'describe-elements',
	default: {} as Question,
})

export function useQuestion(): Question {
	return useRecoilValue(experimentState)
}

export function useSetQuestion(): SetterOrUpdater<Question> {
	return useSetRecoilState(experimentState)
}

export function useResetQuestion(): Resetter {
	return useResetRecoilState(experimentState)
}
