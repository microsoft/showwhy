/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Hypothesis } from '@showwhy/app-common'
import type { SetterOrUpdater } from 'recoil'
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'

export const HypothesisState = atom<Hypothesis | null>({
	key: 'HypothesisState',
	default: Hypothesis.Change,
})

export function useHypothesisValueState(): Hypothesis | null {
	return useRecoilValue(HypothesisState)
}

export function useSetHypothesisState(): SetterOrUpdater<Hypothesis | null> {
	return useSetRecoilState(HypothesisState)
}

export function useHypothesisState(): [
	Hypothesis | null,
	SetterOrUpdater<Hypothesis | null>,
] {
	return useRecoilState(HypothesisState)
}
