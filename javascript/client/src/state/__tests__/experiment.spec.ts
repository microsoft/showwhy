/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Experiment } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot } from 'recoil'

import { useExperiment, useSetExperiment } from '../experiment'

describe('useExperiment', () => {
	it('should return empty object as default value', () => {
		const { result } = renderHook(() => useExperiment(), {
			wrapper: RecoilRoot,
		})

		expect(result.current).toEqual({})
	})

	it('should return the updated state', () => {
		const define = {
			population: {
				label: 'label test',
				description: 'description test',
			},
		} as Experiment

		const { result } = renderHook(
			() => {
				const setDefineQuestion = useSetExperiment()
				const defineQuestion = useExperiment()
				useEffect(() => {
					setDefineQuestion(define)
				}, [setDefineQuestion])

				return defineQuestion
			},
			{
				wrapper: RecoilRoot,
			},
		)

		expect(result.current).toEqual(define)
	})
})
