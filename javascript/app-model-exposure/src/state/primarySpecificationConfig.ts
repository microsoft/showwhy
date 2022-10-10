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

import { CausalModelLevel } from '../types/causality/CausalModelLevel.js'
import { EstimatorType } from '../types/estimators/EstimatorType.js'
import type { PrimarySpecificationConfig } from '../types/experiments/PrimarySpecificationConfig.js'

export const primarySpecificationConfigState = atom<PrimarySpecificationConfig>(
	{
		key: 'primary-specification-config-state',
		default: {
			causalModel: CausalModelLevel.Maximum,
			type: EstimatorType.PropensityScoreStratification,
		},
	},
)

export function usePrimarySpecificationConfig(): PrimarySpecificationConfig {
	return useRecoilValue(primarySpecificationConfigState)
}

export function useSetPrimarySpecificationConfig(): SetterOrUpdater<PrimarySpecificationConfig> {
	return useSetRecoilState(primarySpecificationConfigState)
}

export function useResetPrimarySpecificationConfig(): Resetter {
	return useResetRecoilState(primarySpecificationConfigState)
}
