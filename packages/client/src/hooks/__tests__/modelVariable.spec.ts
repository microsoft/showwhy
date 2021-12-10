/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { DefinitionType } from '../../common/enums'
import { useDefineQuestion, useSetDefineQuestion } from '../../state'
import { useRemoveDefinition, useSaveDefinition } from '../modelVariable'
import { usePageType } from '../usePageType'

jest.mock('../../state')
jest.mock('../usePageType')

const usePageTypeListenerMock = usePageType as jest.MockedFunction<
	typeof usePageType
>
const useDefineQuestionListenerMock = useDefineQuestion as jest.MockedFunction<
	typeof useDefineQuestion
>
const useSetDefineQuestionListenerMock =
	useSetDefineQuestion as jest.MockedFunction<typeof useSetDefineQuestion>

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
		usePageTypeListenerMock.mockReturnValue(type)
		useDefineQuestionListenerMock.mockReturnValue(question)
		useSetDefineQuestionListenerMock.mockReturnValue(jest.fn())
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
		usePageTypeListenerMock.mockReturnValue(type)
		useDefineQuestionListenerMock.mockReturnValue(question)
		useSetDefineQuestionListenerMock.mockReturnValue(jest.fn())
		const { result } = renderHook(() => useRemoveDefinition(), {
			wrapper: RecoilRoot,
		})
		const response = result.current
		response(question.population.definition[0])
		expect(useSetDefineQuestion()).toHaveBeenCalledWith(expected)
	})
})
