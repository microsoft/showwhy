/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Question } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { useEffect } from 'react'
import { RecoilRoot } from 'recoil'

import { useQuestion, useSetQuestion } from '../question'

describe('useQuestion', () => {
	it('should return empty object as default value', () => {
		const { result } = renderHook(() => useQuestion(), {
			wrapper: RecoilRoot,
		})

		expect(result.current).toEqual({})
	})

	it('should return the updated state', () => {
		const expected = {
			population: {
				label: 'label test',
				description: 'description test',
			},
		} as Question

		const { result } = renderHook(
			() => {
				const setQuestion = useSetQuestion()
				const question = useQuestion()
				useEffect(() => {
					setQuestion(expected)
				}, [setQuestion])

				return question
			},
			{
				wrapper: RecoilRoot,
			},
		)

		expect(result.current).toEqual(expected)
	})
})
