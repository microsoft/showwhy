/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { useRemoveDefinition, useSaveDefinition } from '../modelVariable'
import { usePageType } from '../usePageType'
import { DefinitionType } from '~enums'
import { useDefineQuestion, useSetDefineQuestion } from '~state'

jest.mock('../../state')
jest.mock('../usePageType')

const question = {
	population: {
		label: 'Hurricane',
		description: 'Hurricane',
		definition: [
			{
				id: v4(),
				level: DefinitionType.Primary,
				variable: 'Hurricane',
				description: '',
			},
		],
	},
}

const newDefinition = {
	id: v4(),
	level: 'Secondary',
	variable: '>= 1979',
	description: '',
}

describe('modelVariableHooks', () => {
	it('useSaveDefinition', () => {
		const type = 'population'
		const expected = {
			...question,
			[type]: {
				...question[type],
				definition: [...question[type].definition, newDefinition],
			},
		}
		usePageType.mockReturnValue(type)
		useDefineQuestion.mockReturnValue(question)
		useSetDefineQuestion.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useSaveDefinition(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(newDefinition)
		expect(useSetDefineQuestion()).toHaveBeenCalledWith(expected)
	})

	it('useRemoveDefinition', () => {
		const type = 'population'
		const expected = {
			...question,
			[type]: {
				...question[type],
				definition: [],
			},
		}
		usePageType.mockReturnValue(type)
		useDefineQuestion.mockReturnValue(question)
		useSetDefineQuestion.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useRemoveDefinition(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(question.population.definition[0])
		expect(useSetDefineQuestion()).toHaveBeenCalledWith(expected)
	})
})
