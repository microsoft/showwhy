/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

import { TimeAlignmentOptions } from '../types.js'

export const TimeAlignmentState = atom<string>({
	key: 'TimeAlignmentState',
	default:
		Object.keys(TimeAlignmentOptions)[
			Object.values(TimeAlignmentOptions).indexOf(
				TimeAlignmentOptions.Staggered_Design,
			)
		],
})

export function useTimeAlignmentValueState(): string {
	return useRecoilValue(TimeAlignmentState)
}

export function useSetTimeAlignmentState(): SetterOrUpdater<string> {
	return useSetRecoilState(TimeAlignmentState)
}

export function useTimeAlignmentState(): [string, SetterOrUpdater<string>] {
	return useRecoilState(TimeAlignmentState)
}
