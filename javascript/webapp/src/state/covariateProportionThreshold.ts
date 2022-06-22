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

export const covariateProportionThresholdState = atom<number>({
	key: 'confounder-proportion-threshold',
	default: 10,
})

export function useCovariateProportionThreshold(): number {
	return useRecoilValue(covariateProportionThresholdState)
}

export function useSetCovariateProportionThreshold(): SetterOrUpdater<number> {
	return useSetRecoilState(covariateProportionThresholdState)
}

export function useResetCovariateProportionThreshold(): Resetter {
	return useResetRecoilState(covariateProportionThresholdState)
}
