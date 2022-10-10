/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	DomainModel,
	PopulationSpec,
} from '../types/api/EstimateEffectRequest.js'
import type { Definition } from '../types/experiments/Definition.js'

export function buildSpecs(
	dataframeName: string,
	population: Definition[],
	exposure: Definition[],
	outcome: Definition[],
): {
	population_specs: PopulationSpec[]
	treatment_specs: DomainModel[]
	outcome_specs: DomainModel[]
} {
	const populationSpecs = population.map(p => {
		return {
			type: p.level,
			label: p.variable || '',
			dataframe: dataframeName,
			variable: p.column === dataframeName ? undefined : p.column,
		}
	})
	const treatmentSpecs = exposure.map(e => {
		return {
			type: e.level,
			label: e.variable,
			variable: e.column,
		}
	})
	const outcomeSpecs = outcome.map(o => {
		return {
			type: o.level,
			label: o.variable,
			variable: o.column,
		}
	})
	return {
		population_specs: populationSpecs,
		treatment_specs: treatmentSpecs,
		outcome_specs: outcomeSpecs,
	}
}
