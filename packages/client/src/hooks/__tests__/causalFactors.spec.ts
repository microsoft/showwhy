/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import {
	useAddOrEditFactorTestable as useAddOrEditFactor,
	useAlternativeModelsTestable as useAlternativeModels,
	useDeleteCausalFactorTestable as useDeleteCausalFactor,
	useExcludedFactorsTestable as useExcludedFactors,
} from '../causalFactors'
import { BeliefDegree, CausalModelLevel } from '~interfaces'

const causalFactors = [
	{
		id: v4(),
		description: '',
		variable: 'Population',
		causes: {
			causeOutcome: {
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
			},
			causedByExposure: {
				causes: true,
				degree: BeliefDegree.Strong,
				reasoning: '',
			},
		},
	},
	{
		id: v4(),
		description: '',
		variable: 'Min_Pressure',
		causes: {
			causeOutcome: {
				causes: true,
				degree: BeliefDegree.Strong,
				reasoning: '',
			},
		},
	},
	{
		id: v4(),
		description: '',
		variable: 'Max_Pressure',
		causes: {
			causeOutcome: {
				causes: true,
				degree: BeliefDegree.Weak,
				reasoning: '',
			},
		},
	},
	{
		id: v4(),
		description: '',
		variable: 'Pressure',
		causes: {
			causeExposure: {
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
			},
			causeOutcome: {
				causes: true,
				degree: BeliefDegree.Moderate,
				reasoning: '',
			},
		},
	},
]
const newItem = {
	id: v4(),
	description: '',
	variable: 'Category',
	causes: {
		causeOutcome: {
			causes: true,
			degree: BeliefDegree.Strong,
			reasoning: '',
		},
	},
}

describe('causalFactorsHooks', () => {
	it('useExcludedFactors', () => {
		const expected = [causalFactors[0].variable]
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
		response(causalFactors[0])
		expect(setCausalFactors).toHaveBeenCalledWith(expected)
	})

	describe('useAlternativeModels', () => {
		it('Maximum Model', () => {
			const expected = {
				confounders: [causalFactors[3].variable],
				outcomeDeterminants: [causalFactors[1].variable],
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
				outcomeDeterminants: [causalFactors[1].variable],
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
				confounders: [causalFactors[3].variable],
				outcomeDeterminants: [causalFactors[1].variable],
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
				confounders: [causalFactors[3].variable],
				outcomeDeterminants: [causalFactors[1].variable],
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
		response(causalFactors[1])
		expect(setCausalFactors).toHaveBeenCalledWith(causalFactors)
	})
})
