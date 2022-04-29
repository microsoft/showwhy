/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AlternativeModels, AlternativeModelSpec } from '@showwhy/types'
import {
	CausalityLevel,
	DefinitionType,
	EstimatorGroup,
	EstimatorType,
} from '@showwhy/types'

export const estimator = {
	group: EstimatorGroup.Exposure,
	type: EstimatorType.InversePropensityWeighting,
}
export const model = {
	confounders: ['confounder1', 'confounder2'],
	outcomeDeterminants: ['outcomeDeterminant1', 'outcomeDeterminant2'],
	exposureDeterminants: ['exposureDeterminant1', 'exposureDeterminant2'],
}

export const model2 = {
	confounders: [],
	outcomeDeterminants: [],
	exposureDeterminants: [],
}

export const url = 'http://localhost:8080/data/data.csv'

export const fileName = 'data.csv'

export const spec_ids = ['1234', '5678', '9012']

export const population = [
	{
		id: '1',
		description: 'Population 1',
		variable: 'pop',
		column: 'pop_col',
		level: CausalityLevel.Primary,
		type: DefinitionType.Population,
	},
]

export const exposure = [
	{
		id: '2',
		description: 'Exposure 1',
		variable: 'exp',
		column: 'exp_col',
		level: CausalityLevel.Primary,
		type: DefinitionType.Exposure,
	},
]

export const outcome = [
	{
		id: '3',
		description: 'Outcome 1',
		variable: 'out',
		column: 'out_col',
		level: CausalityLevel.Primary,
		type: DefinitionType.Outcome,
	},
]

export const props = {
	definitions: [...population, ...exposure, ...outcome],
	estimators: [estimator],
	refutationCount: 10,
	confidenceInterval: false,
	maximumLevel: getExpectedModel('Maximum', model),
	minimumModel: getExpectedModel('Minimum', model),
	unadjustedModel: getExpectedModel('Unadjusted', model2),
}
export function getExpectedModel(
	name: string,
	model: AlternativeModels,
): AlternativeModelSpec {
	return {
		type: `${name} Model`,
		label: `${name} Model`,
		confounders: [...model.confounders],
		outcome_determinants: [...model.outcomeDeterminants],
	}
}
