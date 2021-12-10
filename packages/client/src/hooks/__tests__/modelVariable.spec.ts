/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { DefinitionType } from '../../common/enums'
import { useRemoveDefinition, useSaveDefinition } from '../modelVariable'

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
		const setDefineQuestion = jest.fn()
		const { result } = renderHook(
			() => useSaveDefinition(type, question, setDefineQuestion),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(newDefinition)
		expect(setDefineQuestion).toHaveBeenCalledWith(expected)
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
		const setDefineQuestion = jest.fn()
		const { result } = renderHook(
			() => useRemoveDefinition(type, question, setDefineQuestion),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(question.population.definition[0])
		expect(setDefineQuestion).toHaveBeenCalledWith(expected)
	})
})
