/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { BeliefDegree, CausalModelLevel } from '../../common/enums'
import { useCausalFactors, useSetCausalFactors } from '../../state'
import {
	useAddOrEditFactor,
	useAlternativeModels,
	useDeleteCausalFactor,
	useExcludedFactors,
} from '../causalFactors'

jest.mock('../../state/causalFactors')

//To get a mocked function that both fulfills the mocked function type and the jest mock type
const useCausalFactorsListenerMock = useCausalFactors as jest.MockedFunction<
	typeof useCausalFactors
>

const useSetCausalFactorsListenerMock =
	useSetCausalFactors as jest.MockedFunction<typeof useSetCausalFactors>

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
	useCausalFactorsListenerMock.mockReturnValue(causalFactors)
	useSetCausalFactorsListenerMock.mockReturnValue(jest.fn())

	it('useExcludedFactors', () => {
		const expected = [causalFactors[0].variable]
		const { result } = renderHook(() => useExcludedFactors(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		expect(response).toEqual(expected)
	})

	it('useDeleteCausalFactor', () => {
		const expected = [...causalFactors.slice(1)]
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
	useCausalFactorsListenerMock.mockReturnValue(causalFactors)
	useSetCausalFactorsListenerMock.mockReturnValue(jest.fn())

	it('add factor', () => {
		const expected = [...causalFactors, newItem]
		const { result } = renderHook(() => useAddOrEditFactor(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(newItem)
		expect(useSetCausalFactors()).toHaveBeenCalledWith(expected)
	})

	it('edit factor', () => {
		const { result } = renderHook(() => useAddOrEditFactor(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(causalFactors[1])
		expect(useSetCausalFactors()).toHaveBeenCalledWith(causalFactors)
	})
})
