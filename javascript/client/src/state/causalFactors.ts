/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '@showwhy/types'
import {
	atom,
	Resetter,
	SetterOrUpdater,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

const causalFactorsState = atom<CausalFactor[]>({
	key: 'causal-factors',
	default: [],
})

export function useCausalFactors(): CausalFactor[] {
	return useRecoilValue(causalFactorsState)
}

export function useSetCausalFactors(): SetterOrUpdater<CausalFactor[]> {
	return useSetRecoilState(causalFactorsState)
}

export function useResetCausalFactors(): Resetter {
	return useResetRecoilState(causalFactorsState)
}
