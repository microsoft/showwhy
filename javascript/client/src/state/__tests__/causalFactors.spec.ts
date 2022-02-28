/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot } from 'recoil'
import { useSetCausalFactors, useCausalFactors } from '../causalFactors'

describe('useCausalFactors', () => {
	it('should return empty array as default value', () => {
		const { result } = renderHook(() => useCausalFactors(), {
			wrapper: RecoilRoot,
		})

		expect(result.current).toEqual([])
	})

	it('should return the updated state', () => {
		const causal = [
			{
				id: 'test id',
				description: 'test description',
				variable: 'test variable',
			},
		] as CausalFactor[]

		const { result } = renderHook(
			() => {
				const setCausalFactor = useSetCausalFactors()
				const causalFactor = useCausalFactors()
				useEffect(() => {
					setCausalFactor(causal)
				}, [setCausalFactor])

				return causalFactor
			},
			{
				wrapper: RecoilRoot,
			},
		)

		expect(result.current).toEqual(causal)
	})
})
