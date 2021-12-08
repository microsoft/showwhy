/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { useCausalFactors, useSetCausalFactors } from '../../state'
import {
	useAddOrEditFactor,
	useAlternativeModels,
	useDeleteCausalFactor,
	useExcludedFactors,
} from '../causalFactors'
import { BeliefDegree, CausalModelLevel } from '~enums'
jest.mock('../../state/causalFactors')

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
		useCausalFactors.mockReturnValue(causalFactors)
		const { result } = renderHook(() => useExcludedFactors(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useDeleteCausalFactor', () => {
		const expected = [...causalFactors.slice(1)]
		useCausalFactors.mockReturnValue(causalFactors)
		useSetCausalFactors.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useDeleteCausalFactor(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(causalFactors[0])
		expect(useSetCausalFactors()).toHaveBeenCalledWith(expected)
	})

	describe('useAlternativeModels', () => {
		it('Maximum Model', () => {
			const expected = {
				confounders: [causalFactors[3].variable],
				outcomeDeterminants: [causalFactors[1].variable],
			}
			useCausalFactors.mockReturnValue(causalFactors)
			useSetCausalFactors.mockReturnValue(jest.fn())
			const { result } = renderHook(
				() => useAlternativeModels(CausalModelLevel.Maximum),
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
			useCausalFactors.mockReturnValue(causalFactors)
			useSetCausalFactors.mockReturnValue(jest.fn())
			const { result } = renderHook(
				() => useAlternativeModels(CausalModelLevel.Minimum),
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
			useCausalFactors.mockReturnValue(causalFactors)
			useSetCausalFactors.mockReturnValue(jest.fn())
			const { result } = renderHook(
				() => useAlternativeModels(CausalModelLevel.Intermediate),
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
			useCausalFactors.mockReturnValue(causalFactors)
			useSetCausalFactors.mockReturnValue(jest.fn())
			const { result } = renderHook(
				() => useAlternativeModels(CausalModelLevel.Maximum),
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
	it('add factor', () => {
		const expected = [...causalFactors, newItem]
		useCausalFactors.mockReturnValue(causalFactors)
		useSetCausalFactors.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useAddOrEditFactor(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(newItem)
		expect(useSetCausalFactors()).toHaveBeenCalledWith(expected)
	})

	it('edit factor', () => {
		useCausalFactors.mockReturnValue(causalFactors)
		useSetCausalFactors.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useAddOrEditFactor(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(causalFactors[1])
		expect(useSetCausalFactors()).toHaveBeenCalledWith(causalFactors)
	})
})
