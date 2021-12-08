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
import { DescribeElements } from '~interfaces'

const defineQuestionState = atom<DescribeElements>({
	key: 'describe-elements',
	default: {} as DescribeElements,
})

export function useDefineQuestion(): DescribeElements {
	return useRecoilValue(defineQuestionState)
}

export function useSetDefineQuestion(): SetterOrUpdater<DescribeElements> {
	return useSetRecoilState(defineQuestionState)
}

export function useResetDefineQuestion(): Resetter {
	return useResetRecoilState(defineQuestionState)
}
