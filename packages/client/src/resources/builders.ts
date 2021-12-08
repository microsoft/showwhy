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
import { EstimatorsType, NodeTypes, RefutationTypes } from '~enums'
import {
	AlternativeModels,
	AlternativeModelsReq,
	ElementDefinition,
	Estimator,
	Model,
	NodeRequest,
} from '~interfaces'
import { GenericObject } from '~types'

interface Node extends GenericObject {
	type: NodeTypes
}

export const buildNodes = (nodes: Node[]): NodeRequest => {
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

export const buildSpecs = (
	dataframeName: string,
	population: ElementDefinition[],
	exposure: ElementDefinition[],
	outcome: ElementDefinition[],
) => {
	const populationSpecs = population.map(p => {
		const pop: {
			type: string
			label: string
			dataframe: string
			population_id?: string
		} = {
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

export const buildModelLevel = (
	modelName: string,
	model: AlternativeModels,
): AlternativeModelsReq | undefined => {
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

export const models = (
	max: AlternativeModels,
	min: AlternativeModels,
	interm: AlternativeModels,
	unadju: AlternativeModels,
): Model[] => {
	const modelsList: any[] = []
	const maximum = buildModelLevel('Maximum', max)

	if (maximum) {
		modelsList.push(maximum)
	}

	const minimum = buildModelLevel('Minimum', min)

	if (minimum) {
		modelsList.push(minimum)
	}

	const unadjusted = buildModelLevel('Unadjusted', unadju)
	modelsList.push(unadjusted)

	return modelsList
}

export const buildEstimators = (estimators: Estimator[]) => {
	return estimators.map(estimator => ({
		type: getModelTypeByEstimatorGroup(estimator.group),
		label: estimator.type ?? EstimatorsType.InversePropensityWeighting,
		require_propensity_score:
			estimator.type !== EstimatorsType.LinearRegression,
		method_name: `backdoor.${getModelNameByEstimatorType(estimator.type)}`,
	}))
}

export const buildRefutationSpecs = (
	refutationType: RefutationTypes,
): { num_simulations: number } => {
	return {
		num_simulations: getSimulationNumByRefuterType(refutationType),
	}
}
