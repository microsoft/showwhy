/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElementDefinition } from '@showwhy/types'
import type { Spec, PopulationSpec } from './types'

export function buildSpecs(
	dataframeName: string,
	population: ElementDefinition[],
	exposure: ElementDefinition[],
	outcome: ElementDefinition[],
): {
	population_specs: PopulationSpec[]
	treatment_specs: Spec[]
	outcome_specs: Spec[]
} {
	const populationSpecs = population.map(p => {
		const pop = {
			type: p.level,
			label: p.variable || '',
			dataframe: dataframeName,
			population_id: p.column,
		}
		return pop
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
