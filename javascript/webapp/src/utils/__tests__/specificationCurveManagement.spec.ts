/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Specification } from '@showwhy/types'

import { buildOutcomeGroups } from '~utils/specificationCurveManagement'

const defaultObject = {
	id: '',
	taskId: '123',
	population: 'pop 1',
	treatment: 'treat 1',
	outcome: 'out 1',
	causalModel: 'one',
	estimator: 'one',
	estimatorConfig: 'estimator conf',
	estimatedEffect: 0.5,
	causalModelSHAP: 5,
	estimatorSHAP: 5,
	populationSHAP: 5,
	treatmentSHAP: 5,
	refuterPlaceboTreatment: null,
	refuterDataSubset: null,
	refuterRandomCommonCause: null,
	refuterBootstrap: null,
	populationType: 'Primary',
	populationSize: 2,
	treatmentType: '',
	outcomeType: 'Primary',
	c95Upper: 1,
	c95Lower: 0,
	refutationResult: 1,
}

describe('specificationCurveManagementUtils', () => {
	it('buildOutcomeGroups with one output', () => {
		const specifications: Specification[] = [
			{
				...defaultObject,
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				estimatedEffect: 0.7,
			},
		]

		const expected = specifications.map((x, index) => ({
			...x,
			id: 'A' + (index + 1),
		}))

		const result = buildOutcomeGroups(specifications)

		expect(result).toEqual(expected)
	})

	it('buildOutcomeGroups with multiple outputs (3)', () => {
		const specifications: Specification[] = [
			{
				...defaultObject,
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				estimatedEffect: 0.7,
			},
			{
				...defaultObject,
				outcomeType: 'Secondary',
				outcome: 'Secondary',
			},
			{
				...defaultObject,
				outcomeType: 'Secondary',
				outcome: 'Third',
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				outcomeType: 'Secondary',
				outcome: 'Secondary',
				estimatedEffect: 0.7,
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				outcomeType: 'Secondary',
				outcome: 'Third',
				estimatedEffect: 0.1,
			},
		]

		const expected = [
			{
				...defaultObject,
				treatment: 'pop 2',
				outcomeType: 'Secondary',
				outcome: 'Third',
				estimatedEffect: 0.1,
				id: 'C2',
			},
			{
				...defaultObject,
				id: 'A1',
			},
			{
				...defaultObject,
				outcomeType: 'Secondary',
				outcome: 'Secondary',
				id: 'B1',
			},
			{
				...defaultObject,
				outcomeType: 'Secondary',
				outcome: 'Third',
				id: 'C1',
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				estimatedEffect: 0.7,
				id: 'A2',
			},
			{
				...defaultObject,
				treatment: 'pop 2',
				outcomeType: 'Secondary',
				outcome: 'Secondary',
				estimatedEffect: 0.7,
				id: 'B2',
			},
		]

		const result = buildOutcomeGroups(specifications)
		expect(result).toEqual(expected)
	})
})
