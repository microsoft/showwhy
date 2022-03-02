/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	PrimarySpecificationConfig,
	EstimatorType,
	CausalModelLevel,
} from '@showwhy/types'
import {
	atom,
	Resetter,
	SetterOrUpdater,
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
