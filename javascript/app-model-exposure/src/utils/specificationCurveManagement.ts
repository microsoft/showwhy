/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import isNull from 'lodash/isNull'

import { RefutationResult } from '../types/refutation/RefutationResult.js'
import type { CovariateBalance } from '../types/visualization/CovariateBalance.js'
import type { Specification } from '../types/visualization/Specification.js'

/* eslint-disable */

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
		covariateBalance: d.covariate_balance,
		refuterPlaceboTreatment: isNull(d.placebo_treatment)
			? null
			: +d.placebo_treatment,
		refuterRandomCommonCause: isNull(d.random_common_cause)
			? null
			: +d.random_common_cause,
		populationType: d.population_type,
		populationSize: d.population_size,
		treatmentType: d.treatment_type,
		outcomeType: d.outcome_type,
		c95Upper: d.upper_bound,
		c95Lower: d.lower_bound,
		refutationResult: d.refutation_result,
	}
}

function sortByEstimatedEffect(specifications: Specification[]) {
	return specifications.sort((a, b) => a?.estimatedEffect - b?.estimatedEffect)
}

export function buildOutcomeGroups(
	specifications: Specification[],
): Specification[] {
	const primaryOutcome = sortByEstimatedEffect(
		specifications.filter((x) => x.outcomeType === 'Primary'),
	)

	const secondaryOutcomes = specifications
		.filter((x) => x.outcomeType !== 'Primary')
		.sort((a, b) => a?.outcome.localeCompare(b?.outcome))

	const { grouped, groups, outcomes } = groupBySpecification(primaryOutcome)
	const secondaries = groupBySpecification(secondaryOutcomes, groups, outcomes)

	return sortByEstimatedEffect(grouped.concat(secondaries.grouped))
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

function validateCovariateConfounders(
	confounders: string[],
	covariateBalance: CovariateBalance,
	confounderThreshold: number,
): string[] {
	return confounders?.filter(
		(x) =>
			confounderThreshold - (covariateBalance?.adjusted[x] as number) * 100 < 0,
	)
}

export function returnFailedConfounders(
	d: Specification,
	confounderThreshold?: number,
): string[] {
	const confounders =
		d.covariateBalance?.adjusted && Object.keys(d.covariateBalance?.adjusted)
	if (confounders && d.covariateBalance?.adjusted) {
		return confounderThreshold
			? validateCovariateConfounders(
					confounders,
					d.covariateBalance,
					confounderThreshold,
			  )
			: []
	}
	return []
}

export function returnValidatedSpecification(
	d: Specification,
	confounderThreshold?: number,
): Specification {
	if (!confounderThreshold) {
		return d
	}
	const confounders =
		d.covariateBalance?.adjusted && Object.keys(d.covariateBalance?.adjusted)
	if (confounders && d.covariateBalance?.adjusted) {
		const failedConfounders = validateCovariateConfounders(
			confounders,
			d.covariateBalance,
			confounderThreshold,
		)
		const total = (failedConfounders?.length / confounders.length) * 100 || 0

		return {
			...d,
			refutationResult:
				d.refutationResult === RefutationResult.PassedAll &&
				total < confounderThreshold
					? RefutationResult.PassedAll
					: RefutationResult.FailedCritical,
		} as Specification
	}
	return d
}
