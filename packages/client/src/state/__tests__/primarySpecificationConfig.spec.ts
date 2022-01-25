/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import {
	usePrimarySpecificationConfig,
	primarySpecificationConfigState,
} from '../primarySpecificationConfig'
import {
	PrimarySpecificationConfig,
	EstimatorType,
	CausalModelLevel,
} from '~types'

describe('primarySpecificationConfig', () => {
	describe('usePrimarySpecificationConfig', () => {
		it('should return the default value', () => {
			const expected = {
				causalModel: CausalModelLevel.Maximum,
				type: EstimatorType.PropensityScoreStratification,
			}
			const { result } = renderHook(() => usePrimarySpecificationConfig(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})

	describe('useSetPrimarySpecificationConfig', () => {
		it('should change the config state', () => {
			const expected = {
				causalModel: CausalModelLevel.Maximum,
				type: EstimatorType.LinearRegression,
			} as PrimarySpecificationConfig

			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(primarySpecificationConfigState, expected),
			)
				.getLoadable(primarySpecificationConfigState)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})
})
