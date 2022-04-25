/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactorType, DefinitionType } from '@showwhy/types'

import { isCausalFactorType } from '../definition'

describe('Definition Functions', () => {
	it('is population a causal factor -> false', () => {
		const type = DefinitionType.Population
		const result = isCausalFactorType(type as any)
		expect(result).toBeFalsy()
	})
	it('is exposure a causal factor -> false', () => {
		const type = DefinitionType.Exposure
		const result = isCausalFactorType(type as any)
		expect(result).toBeFalsy()
	})
	it('is outcome a causal factor -> false', () => {
		const type = DefinitionType.Outcome
		const result = isCausalFactorType(type as any)
		expect(result).toBeFalsy()
	})
	it('is confounder a causal factor -> true', () => {
		const type = CausalFactorType.Confounders
		const result = isCausalFactorType(type)
		expect(result).toBeTruthy()
	})
	it('is outcome determinant a causal factor -> true', () => {
		const type = CausalFactorType.CauseOutcome
		const result = isCausalFactorType(type)
		expect(result).toBeTruthy()
	})
	it('is exposure determinant a causal factor -> true', () => {
		const type = CausalFactorType.CauseExposure
		const result = isCausalFactorType(type)
		expect(result).toBeTruthy()
	})
})
