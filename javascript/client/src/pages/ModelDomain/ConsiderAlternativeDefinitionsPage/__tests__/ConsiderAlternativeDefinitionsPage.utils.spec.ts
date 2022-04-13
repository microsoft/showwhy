/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { CausalityLevel, DefinitionType } from '@showwhy/types'

import { updateListTypes } from '../ConsiderAlternativeDefinitionsPage.utils'

describe('Consider Alternative Models Utils', () => {
	test('updateListTypes return list with same type as secondary level', () => {
		const expected: ElementDefinition[] = [
			{
				id: 'one',
				level: CausalityLevel.Secondary,
				variable: 'variable',
				description: 'description',
				type: DefinitionType.Population,
			},
			{
				id: 'two',
				level: CausalityLevel.Primary,
				variable: 'variable two',
				description: 'description',
				type: DefinitionType.Outcome,
			},
		]

		const newList: ElementDefinition[] = [
			{
				id: 'one',
				level: CausalityLevel.Primary,
				variable: 'variable',
				description: 'description',
				type: DefinitionType.Population,
			},
			{
				id: 'two',
				level: CausalityLevel.Primary,
				variable: 'variable two',
				description: 'description',
				type: DefinitionType.Outcome,
			},
		]

		const result = updateListTypes(newList, DefinitionType.Population)
		expect(result).toEqual(expected)
	})
})
