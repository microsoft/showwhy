/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { PrimarySpecificationConfig } from '@showwhy/types'
import { CausalModelLevel, EstimatorType } from '@showwhy/types'
import type { Resetter, SetterOrUpdater } from 'recoil'
import {
	atom,
	useRecoilValue,
	useResetRecoilState,
	useSetRecoilState,
} from 'recoil'

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
