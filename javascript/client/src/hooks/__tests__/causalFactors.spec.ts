/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import {
	type CausalFactor,
	BeliefDegree,
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
} from '../causalFactors'

const causalFactors: CausalFactor[] = [
	{
		id: v4(),
		description: '',
		variable: 'Population',
		level: CausalityLevel.Primary,
		causes: {
			causeOutcome: BeliefDegree.Moderate,
			causeExposure: BeliefDegree.None,
			reasoning: '',
		},
	},
	{
		id: v4(),
		description: '',
		level: CausalityLevel.Primary,
		variable: 'Min_Pressure',
		causes: {
			causeOutcome: BeliefDegree.Strong,
			causeExposure: BeliefDegree.None,
			reasoning: '',
		},
	},
	{
		id: v4(),
		description: '',

		level: CausalityLevel.Primary,
		variable: 'Max_Pressure',
		causes: {
			causeOutcome: BeliefDegree.Weak,
			causeExposure: BeliefDegree.None,
			reasoning: '',
		},
	},
	{
		id: v4(),
		description: '',
		variable: 'Pressure',
		level: CausalityLevel.Primary,
		causes: {
			causeOutcome: BeliefDegree.Moderate,
			causeExposure: BeliefDegree.Moderate,
			reasoning: '',
		},
	},
]
const newItem: CausalFactor = {
	id: v4(),
	description: '',
	variable: 'Category',

	level: CausalityLevel.Primary,
	causes: {
		causeOutcome: BeliefDegree.Strong,
		causeExposure: BeliefDegree.None,
		reasoning: '',
	},
}

describe('causalFactorsHooks', () => {
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
				outcomeDeterminants: [
					causalFactors[0]!.variable,
					causalFactors[1]!.variable,
				],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(CausalModelLevel.Maximum, true, causalFactors),
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
					useAlternativeModels(CausalModelLevel.Minimum, true, causalFactors),
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
				outcomeDeterminants: [
					causalFactors[0]!.variable,
					causalFactors[1]!.variable,
				],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(
						CausalModelLevel.Intermediate,
						true,
						causalFactors,
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
				outcomeDeterminants: [
					causalFactors[0]!.variable,
					causalFactors[1]!.variable,
				],
			}
			const { result } = renderHook(
				() =>
					useAlternativeModels(CausalModelLevel.Maximum, true, causalFactors),
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
