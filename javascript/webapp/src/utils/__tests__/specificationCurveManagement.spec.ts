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
				treatment: 'treat 2',
				estimatedEffect: 0.7,
			},
			{
				...defaultObject,
			},
			{
				...defaultObject,
				causalModel: 'two',
				outcome: 'out 2',
				estimatedEffect: 0.9,
			},
			{
				...defaultObject,
				outcome: 'out 3',
				estimatedEffect: 1,
				causalModel: 'two',
			},
			{
				...defaultObject,
				causalModel: 'two',
				estimatedEffect: 0.8,
			},
			{
				...defaultObject,
				outcome: 'out 2',
			},
			{
				...defaultObject,
				treatment: 'treat 2',
				outcome: 'out 2',
				estimatedEffect: 0.7,
			},
			{
				...defaultObject,
				outcome: 'out 3',
				estimatedEffect: 0.7,
			},
			{
				...defaultObject,
				treatment: 'treat 2',
				outcome: 'out 3',
			},
		]

		const expected = [
			{
				...defaultObject,
				id: 'A2',
			},
			{
				...defaultObject,
				outcome: 'out 2',
				id: 'B2',
			},
			{
				...defaultObject,
				treatment: 'treat 2',
				outcome: 'out 3',
				id: 'C1',
			},
			{
				...defaultObject,
				treatment: 'treat 2',
				estimatedEffect: 0.7,
				id: 'A1',
			},
			{
				...defaultObject,
				treatment: 'treat 2',
				outcome: 'out 2',
				estimatedEffect: 0.7,
				id: 'B1',
			},
			{
				...defaultObject,
				outcome: 'out 3',
				estimatedEffect: 0.7,
				id: 'C2',
			},
			{
				...defaultObject,
				causalModel: 'two',
				estimatedEffect: 0.8,
				id: 'A3',
			},
			{
				...defaultObject,
				causalModel: 'two',
				outcome: 'out 2',
				estimatedEffect: 0.9,
				id: 'B3',
			},
			{
				...defaultObject,
				outcome: 'out 3',
				estimatedEffect: 1,
				causalModel: 'two',
				id: 'C3',
			},
		].sort(function (a, b) {
			return a?.id.localeCompare(b?.id)
		})

		const result = buildOutcomeGroups(specifications).sort(function (a, b) {
			return a?.id.localeCompare(b?.id)
		})

		expect(result).toEqual(expected)
	})
})
