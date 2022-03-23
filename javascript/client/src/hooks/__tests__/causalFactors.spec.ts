/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import type { CausalFactor } from '@showwhy/types'
import {
	BeliefDegree,
	CausalFactorType,
	CausalityLevel,
	CausalModelLevel,
} from '@showwhy/types'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'

import {
	useAddOrEditFactorTestable as useAddOrEditFactor,
	useAlternativeModelsTestable as useAlternativeModels,
	useDeleteCausalFactorTestable as useDeleteCausalFactor,
	useExcludedFactorsTestable as useExcludedFactors,
} from '../causalFactors'

const causalFactors: CausalFactor[] = [
	{
		id: v4(),
		description: '',
		variable: 'Population',
		level: CausalityLevel.Primary,
		causes: [
			{
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
				type: CausalFactorType.CauseOutcome,
			},
			{
				causes: true,
				degree: BeliefDegree.Strong,
				reasoning: '',
				type: CausalFactorType.CausedByExposure,
			},
		],
	},
	{
		id: v4(),
		description: '',
		level: CausalityLevel.Primary,
		variable: 'Min_Pressure',
		causes: [
			{
				causes: true,
				degree: BeliefDegree.Strong,
				reasoning: '',
				type: CausalFactorType.CauseOutcome,
			},
		],
	},
	{
		id: v4(),
		description: '',

		level: CausalityLevel.Primary,
		variable: 'Max_Pressure',
		causes: [
			{
				causes: true,
				degree: BeliefDegree.Weak,
				reasoning: '',
				type: CausalFactorType.CauseOutcome,
			},
		],
	},
	{
		id: v4(),
		description: '',
		variable: 'Pressure',
		level: CausalityLevel.Primary,
		causes: [
			{
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
				type: CausalFactorType.CauseExposure,
			},
			{
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
				type: CausalFactorType.CauseOutcome,
			},
		],
	},
]
const newItem: CausalFactor = {
	id: v4(),
	description: '',
	variable: 'Category',

	level: CausalityLevel.Primary,
	causes: [
		{
			causes: true,
			degree: BeliefDegree.Strong,
			reasoning: '',
			type: CausalFactorType.CauseOutcome,
		},
	],
}

describe('causalFactorsHooks', () => {
	it('useExcludedFactors', () => {
		const expected = [causalFactors[0]!.variable]
		const { result } = renderHook(() => useExcludedFactors(causalFactors), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useDeleteCausalFactor', () => {
		const setCausalFactors = jest.fn()
		const expected = [...causalFactors.slice(1)]
		const { result } = renderHook(
			() => useDeleteCausalFactor(causalFactors, setCausalFactors),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(causalFactors[0]!)
		expect(setCausalFactors).toHaveBeenCalledWith(expected)
	})

	describe('useAlternativeModels', () => {
		it('Maximum Model', () => {
			const expected = {
				confounders: [causalFactors[3]!.variable],
				exposureDeterminants: [],
				outcomeDeterminants: [causalFactors[1]!.variable],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(CausalModelLevel.Maximum, true, causalFactors, [
						'Population',
					]),
				{
					wrapper: RecoilRoot,
				},
			)
			const response = result.current
			expect(response).toEqual(expected)
		})

		it('Minimum Model', () => {
			const expected = {
				confounders: [],
				exposureDeterminants: [],
				outcomeDeterminants: [causalFactors[1]!.variable],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(CausalModelLevel.Minimum, true, causalFactors, [
						'Population',
					]),
				{
					wrapper: RecoilRoot,
				},
			)
			const response = result.current
			expect(response).toEqual(expected)
		})

		it('Intermediate Model', () => {
			const expected = {
				confounders: [causalFactors[3]!.variable],
				exposureDeterminants: [],
				outcomeDeterminants: [causalFactors[1]!.variable],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(
						CausalModelLevel.Intermediate,
						true,
						causalFactors,
						['Population'],
					),
				{
					wrapper: RecoilRoot,
				},
			)
			const response = result.current
			expect(response).toEqual(expected)
		})

		it('Maximum confounders', () => {
			const expected = {
				confounders: [causalFactors[3]!.variable],
				exposureDeterminants: [],
				outcomeDeterminants: [causalFactors[1]!.variable],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(CausalModelLevel.Maximum, true, causalFactors, [
						'Population',
					]),
				{
					wrapper: RecoilRoot,
				},
			)
			const response = result.current
			expect(response).toEqual(expected)
		})
	})
})

describe('useAddOrEditFactor', () => {
	const setCausalFactors = jest.fn()
	it('add factor', () => {
		const expected = [...causalFactors, newItem]
		const { result } = renderHook(
			() => useAddOrEditFactor(causalFactors, setCausalFactors),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(newItem)
		expect(setCausalFactors).toHaveBeenCalledWith(expected)
	})

	it('edit factor', () => {
		const setCausalFactors = jest.fn()
		const { result } = renderHook(
			() => useAddOrEditFactor(causalFactors, setCausalFactors),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(causalFactors[1]!)
		expect(setCausalFactors).toHaveBeenCalledWith(causalFactors)
	})
})
