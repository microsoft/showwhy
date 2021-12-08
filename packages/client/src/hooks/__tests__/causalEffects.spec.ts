/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { CausalModelLevel, DefinitionType } from '../../common/enums'
import { useDefineQuestion } from '../../state'
import { useCausalEffects } from '../causalEffects'
import { useAlternativeModels, useExcludedFactors } from '../causalFactors'

const useDefineQuestionListenerMock = useDefineQuestion as jest.MockedFunction<
	typeof useDefineQuestion
>
const useExcludedFactorsListenerMock =
	useExcludedFactors as jest.MockedFunction<typeof useExcludedFactors>
const useAlternativeModelsListenerMock =
	useAlternativeModels as jest.MockedFunction<typeof useAlternativeModels>

const question = {
	exposure: {
		label: 'Hurricane',
		description: 'Hurricane',
		definition: [
			{
				id: v4(),
				level: DefinitionType.Primary,
				variable: 'Hurricane',
				description: '',
			},
			{
				id: v4(),
				level: DefinitionType.Secondary,
				variable: 'Hurricane 2',
				description: '',
			},
		],
	},
}

describe('causalEffectsHooks', () => {
	it('returns useCausalEffects', () => {
		const expected = {
			confounders: [],
			outcomeDeterminants: [],
			generalExposure: 'Hurricane',
			generalOutcome: '',
			excludedFactors: ['Hurricane 2'],
			excludedMessage:
				'1 potential control was excluded based on ambiguous causal directions: Hurricane 2.',
		}

		useAlternativeModelsListenerMock.mockReturnValue({
			confounders: [],
			outcomeDeterminants: [],
		})
		useDefineQuestionListenerMock.mockReturnValue(question)
		useExcludedFactorsListenerMock.mockReturnValue(['Hurricane 2'])

		const { result } = renderHook(
			() => {
				return useCausalEffects(CausalModelLevel.Intermediate)
			},
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		expect(response).toEqual(expected)
	})
})
