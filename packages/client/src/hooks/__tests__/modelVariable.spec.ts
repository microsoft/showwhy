/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { jest } from '@jest/globals'
import { renderHook } from '@testing-library/react-hooks'
import { RecoilRoot } from 'recoil'
import { v4 } from 'uuid'
import { DefinitionType, PageType } from '../../common/enums'
import {
	useRemoveDefinitionTestable,
	useSaveDefinitionTestable,
} from '../modelVariable'
import { DescribeElements, CausalFactor } from '~interfaces'

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
} as any as DescribeElements

const newDefinition: CausalFactor = {
	id: v4(),
	level: DefinitionType.Secondary,
	variable: '>= 1979',
	description: '',
}

describe('modelVariableHooks', () => {
	it('useSaveDefinition', () => {
		const type = PageType.Population
		const expected = {
			...question,
			[type]: {
				...question[type],
				definition: [...question[type].definition, newDefinition],
			},
		}
		const setDefineQuestion = jest.fn()
		const { result } = renderHook(
			() => useSaveDefinitionTestable(type, question, setDefineQuestion),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(newDefinition)
		expect(setDefineQuestion).toHaveBeenCalledWith(expected)
	})

	it('useRemoveDefinition', () => {
		const type = PageType.Population
		const expected = {
			...question,
			[type]: {
				...question[type],
				definition: [],
			},
		}
		const setDefineQuestion = jest.fn()
		const { result } = renderHook(
			() => useRemoveDefinitionTestable(type, question, setDefineQuestion),
			{
				wrapper: RecoilRoot,
			},
		)
		const response = result.current
		response(question.population.definition[0])
		expect(setDefineQuestion).toHaveBeenCalledWith(expected)
	})
})
