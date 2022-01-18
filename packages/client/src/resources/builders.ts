/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	getModelNameByEstimatorType,
	getModelTypeByEstimatorGroup,
	getNodeProperties,
	getSimulationNumByRefuterType,
} from './utils'
import {
	DefinitionType,
	EstimatorsType,
	NodeTypes,
	RefutationTypes,
} from '~enums'
import {
	AlternativeModels,
	AlternativeModelsReq,
	ElementDefinition,
	Estimator,
	NodeRequest,
} from '~interfaces'
import { GenericObject } from '~types'

interface Node extends GenericObject {
	type: NodeTypes
}

export function buildNodes(nodes: Node[]): NodeRequest {
	return {
		nodes: nodes.map(node => {
			const { type, ...properties } = node
			return {
				...getNodeProperties(type),
				...properties,
			}
		}),
	} as NodeRequest
}

export interface Spec {
	type: DefinitionType
	label?: string
	variable?: string
}
export interface PopulationSpec {
	type: DefinitionType
	label: string
	dataframe: string
	population_id?: string
}
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

export function buildModelLevel(
	modelName: string,
	model: AlternativeModels,
): AlternativeModelsReq | undefined {
	const modelConfounders = [...model.confounders]
	const modelOutcome = [...model.outcomeDeterminants]
	if (
		!modelConfounders.length &&
		!modelOutcome.length &&
		modelName !== 'Unadjusted'
	) {
		return undefined
	}

	return {
		type: `${modelName} Model`,
		label: `${modelName} Model`,
		confounders: modelConfounders,
		outcome_determinants: modelOutcome,
	}
}

export function models(
	max: AlternativeModels,
	min: AlternativeModels,
	interm: AlternativeModels,
	unadju: AlternativeModels,
): AlternativeModelsReq[] {
	const modelsList: AlternativeModelsReq[] = []
	const maximum = buildModelLevel('Maximum', max)
	if (maximum) {
		modelsList.push(maximum)
	}

	const minimum = buildModelLevel('Minimum', min)
	if (minimum) {
		modelsList.push(minimum)
	}

	const unadjusted = buildModelLevel('Unadjusted', unadju)
	modelsList.push(unadjusted as AlternativeModelsReq)

	return modelsList
}

export interface BuiltEstimator {
	type: string
	label: EstimatorsType
	require_propensity_score: boolean
	method_name: string
}

export function buildEstimators(estimators: Estimator[]): BuiltEstimator[] {
	return estimators.map(estimator => ({
		type: getModelTypeByEstimatorGroup(estimator.group),
		label: estimator.type ?? EstimatorsType.InversePropensityWeighting,
		require_propensity_score:
			estimator.type !== EstimatorsType.LinearRegression,
		method_name: `backdoor.${getModelNameByEstimatorType(estimator.type)}`,
	}))
}

export function buildRefutationSpecs(refutationType: RefutationTypes): {
	num_simulations: number
} {
	return {
		num_simulations: getSimulationNumByRefuterType(refutationType),
	}
}
