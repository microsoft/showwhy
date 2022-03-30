/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Experiment } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'

import { useCausalEffectsTestable as useCausalEffects } from '../causalEffects'

const question = {
	exposure: {
		label: 'Hurricane',
		description: 'Hurricane',
		definition: [
			{
				id: v4(),
				level: CausalityLevel.Primary,
				variable: 'Hurricane',
				description: '',
			},
			{
				id: v4(),
				level: CausalityLevel.Secondary,
				variable: 'Hurricane 2',
				description: '',
			},
		],
	},
} as any as Experiment

describe('causalEffectsHooks', () => {
	it('returns useCausalEffects', () => {
		const expected = {
			confounders: [],
			outcomeDeterminants: [],
			exposureDeterminants: [],
			generalExposure: 'Hurricane',
			generalOutcome: '',
		}

		const { result } = renderHook(
			() => {
				return useCausalEffects(question, {
					confounders: [],
					exposureDeterminants: [],
					outcomeDeterminants: [],
				})
			},
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response).toEqual(expected)
	})
})
