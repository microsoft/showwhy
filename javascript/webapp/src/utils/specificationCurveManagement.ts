/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Specification } from '@showwhy/types'
import isNull from 'lodash/isNull'

// eslint-disable-next-line
export function row2spec(d: any): Specification {
	return {
		id: '',
		taskId: d.task_id,
		population: d.population_name,
		treatment: d.treatment,
		outcome: d.outcome,
		causalModel: d.causal_model,
		estimator: d.estimator,
		estimatorConfig: d.estimator_config,
		estimatedEffect: +d.estimated_effect,
		causalModelSHAP: +d.shap_causal_model,
		estimatorSHAP: +d.shap_estimator,
		populationSHAP: +d.shap_population_name,
		treatmentSHAP: +d.shap_treatment,
		refuterPlaceboTreatment: isNull(d.refuter_placebo_treatment)
			? null
			: +d.refuter_placebo_treatment,
		refuterDataSubset: isNull(d.refuter_data_subset)
			? null
			: +d.refuter_data_subset,
		refuterRandomCommonCause: isNull(d.refuter_random_common_cause)
			? null
			: +d.refuter_random_common_cause,
		refuterBootstrap: isNull(d.refuter_bootstrap) ? null : +d.refuter_bootstrap,
		populationType: d.population_type,
		populationSize: d.population_size,
		treatmentType: d.treatment_type,
		outcomeType: d.outcome_type,
		c95Upper: d.upper_bound,
		c95Lower: d.lower_bound,
		refutationResult: d.refutation_result,
	}
}

export function buildOutcomeGroups(
	specifications: Specification[],
): Specification[] {
	const primaryOutcome = specifications
		.filter(x => x.outcomeType === 'Primary')
		.sort((a, b) => a?.estimatedEffect - b?.estimatedEffect)

	const secondaryOutcomes = specifications
		.filter(x => x.outcomeType !== 'Primary')
		.sort((a, b) => a?.outcome.localeCompare(b?.outcome))

	const { grouped, groups, outcomes } = groupBySpecification(primaryOutcome)
	const secondaries = groupBySpecification(secondaryOutcomes, groups, outcomes)

	return grouped.concat(secondaries.grouped)
}
function returnKeys(item: Specification) {
	return [item.treatment, item.causalModel, item.estimator]
}

function returnGroupLetter(number: number) {
	return String.fromCharCode(97 + number).toUpperCase()
}

function groupBySpecification(
	array: Specification[],
	groups: string[] = [],
	outcomes: string[] = [],
): {
	grouped: Specification[]
	groups: string[]
	outcomes: string[]
} {
	const grouped = array.map((specification: Specification) => {
		const group = JSON.stringify(returnKeys(specification))
		let groupNumber = groups.indexOf(group)

		if (groupNumber < 0) {
			groupNumber = groups.length
			groups.push(group)
		}

		let outcomeNumber = outcomes.indexOf(specification.outcome)
		if (outcomeNumber < 0) {
			outcomes.push(specification.outcome)
			outcomeNumber = outcomes.length - 1
		}

		return {
			...specification,
			id: returnGroupLetter(outcomeNumber) + (groupNumber + 1),
		}
	})

	return {
		grouped,
		outcomes,
		groups,
	}
}
