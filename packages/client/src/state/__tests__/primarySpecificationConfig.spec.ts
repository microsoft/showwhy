/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'
import { CausalModelLevel, EstimatorsType } from '../../common/enums'
import {
	usePrimarySpecificationConfig,
	primarySpecificationConfigState,
} from '../primarySpecificationConfig'
import { PrimarySpecificationConfig } from '~interfaces'

describe('primarySpecificationConfig', () => {
	describe('usePrimarySpecificationConfig', () => {
		it('should return the default value', () => {
			const expected = {
				causalModel: CausalModelLevel.Maximum,
				type: EstimatorsType.PropensityScoreStratification,
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
				type: EstimatorsType.LinearRegression,
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
