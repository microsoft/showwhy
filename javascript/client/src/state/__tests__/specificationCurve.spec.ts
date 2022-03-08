/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot, snapshot_UNSTABLE } from 'recoil'

import {
	defaultConfig,
	specificationCurveConfig,
	useResetSpecificationCurveConfig,
	useSetSpecificationCurveConfig,
	useSpecificationCurveConfig,
} from '../specificationCurveConfig'

describe('specificationCurveState', () => {
	describe('useSpecificationCurveConfig', () => {
		it('should return the default value', () => {
			const expected = defaultConfig
			const { result } = renderHook(() => useSpecificationCurveConfig(), {
				wrapper: RecoilRoot,
			})
			expect(result.current).toEqual(expected)
		})
	})

	describe('useSetRunHistory', () => {
		it('should change the specification curve state', () => {
			const expected = {
				...defaultConfig,
				medianLine: false,
				meanLine: false,
				shapTicks: false,
			}
			const snapshot = snapshot_UNSTABLE(({ set }) =>
				set(specificationCurveConfig, expected),
			)
				.getLoadable(specificationCurveConfig)
				.valueOrThrow()
			expect(snapshot).toBe(expected)
		})
	})

	describe('useResetSpecificationCurveConfig', () => {
		it('should reset the specification curve state', () => {
			const expected = defaultConfig
			const { result } = renderHook(
				() => {
					const setSpecificationCurveConfig = useSetSpecificationCurveConfig()
					const specificationCurveConfig = useSpecificationCurveConfig()
					const reset = useResetSpecificationCurveConfig()
					useEffect(() => {
						setSpecificationCurveConfig({
							...defaultConfig,
							medianLine: false,
							meanLine: false,
							shapTicks: false,
						})
						reset()
					}, [setSpecificationCurveConfig, reset])
					return specificationCurveConfig
				},
				{
					wrapper: RecoilRoot,
				},
			)
			expect(result.current).toEqual(expected)
		})
	})
})
