/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Maybe,
	AlternativeModelSpec,
	GraphNodeType,
	GraphNodeData,
	CausalityLevel,
	AlternativeModels,
	ElementDefinition,
	Estimator,
	RefutationType,
	EstimatorType,
	EstimatorGroup,
	NodeRequest,
} from '@showwhy/types'

interface Node {
	type: GraphNodeType
	[key: string]: any
}

enum NodeIds {
	IdentifyEstimand = 'Identify Estimand',
	CreateCausalGraph = 'Create Causal Graph',
	LoadDataset = 'Load Dataset',
	EstimateEffects = 'Estimate Effects',
	SignificanceTest = 'Significance Test',
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
	type: CausalityLevel
	label?: string
	variable?: string
}
export interface PopulationSpec {
	type: CausalityLevel
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
): Maybe<AlternativeModelSpec> {
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
	_interm: AlternativeModels,
	unadju: AlternativeModels,
): AlternativeModelSpec[] {
	const modelsList: AlternativeModelSpec[] = []
	const maximum = buildModelLevel('Maximum', max)
	if (maximum) {
		modelsList.push(maximum)
	}

	const minimum = buildModelLevel('Minimum', min)
	if (minimum) {
		modelsList.push(minimum)
	}

	const unadjusted = buildModelLevel('Unadjusted', unadju)
	modelsList.push(unadjusted as AlternativeModelSpec)

	return modelsList
}

export interface BuiltEstimator {
	type: string
	label: EstimatorType
	require_propensity_score: boolean
	method_name: string
}

export function buildEstimators(estimators: Estimator[]): BuiltEstimator[] {
	return estimators.map(estimator => ({
		type: getModelTypeByEstimatorGroup(estimator.group),
		label: estimator.type ?? EstimatorType.InversePropensityWeighting,
		require_propensity_score: estimator.type !== EstimatorType.LinearRegression,
		method_name: `backdoor.${getModelNameByEstimatorType(estimator.type)}`,
	}))
}

export function buildRefutationSpecs(refutationType: RefutationType): {
	num_simulations: number
} {
	return {
		num_simulations: getSimulationNumByRefuterType(refutationType),
	}
}

export function buildSignificanceTestsNode(taskIds: string[]): NodeRequest {
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.SignificanceTest,
			spec_ids: taskIds,
		},
	])
	return nodeReq
}

export function buildLoadNode(url: string, fileName: string): NodeRequest {
	const [dataframeName] = fileName.split('.')
	const nodeReq = buildNodes([
		{
			type: GraphNodeType.LoadDataset,
			result: dataframeName,
			url,
		},
	])
	return nodeReq
}

export function getSimulationNumByRefuterType(type: RefutationType): number {
	switch (type) {
		case RefutationType.FullRefutation:
			return 100
		case RefutationType.QuickRefutation:
		default:
			return 10
	}
}

export function getModelTypeByEstimatorGroup(group: EstimatorGroup): string {
	switch (group) {
		case EstimatorGroup.Exposure:
			return 'Treatment Assignment Model'
		case EstimatorGroup.Outcome:
			return 'Outcome Model'
	}
}

export function getModelNameByEstimatorType(type: EstimatorType): string {
	switch (type) {
		case EstimatorType.ForestDoubleMachineLearning:
			return 'econml.dml.CausalForestDML'
		case EstimatorType.LinearDoubleMachineLearning:
			return 'econml.dml.LinearDML'
		case EstimatorType.ForestDoublyRobustLearner:
			return 'econml.dr.ForestDRLearner'
		case EstimatorType.LinearDoublyRobustLearner:
			return 'econml.dr.LinearDRLearner'
		case EstimatorType.LinearRegression:
			return 'linear_regression'
		case EstimatorType.PropensityScoreMatching:
			return 'propensity_score_matching'
		case EstimatorType.PropensityScoreStratification:
			return 'propensity_score_stratification'
		case EstimatorType.InversePropensityWeighting:
			return 'propensity_score_weighting'
	}
}

export function getNodeProperties(type: GraphNodeType): GraphNodeData {
	switch (type) {
		case GraphNodeType.EstimateEffects:
			return {
				type: GraphNodeType.EstimateEffects,
				result: 'estimate_results',
				id: NodeIds.EstimateEffects,
				value: NodeIds.EstimateEffects,
				name: NodeIds.EstimateEffects,
			}
		case GraphNodeType.IdentifyEstimand:
			return {
				type: GraphNodeType.IdentifyEstimand,
				result: 'primary_estimand',
				id: NodeIds.IdentifyEstimand,
				value: NodeIds.IdentifyEstimand,
				name: NodeIds.IdentifyEstimand,
			}
		case GraphNodeType.CreateCausalGraph:
			return {
				type: GraphNodeType.CreateCausalGraph,
				result: 'primary_maximum_model',
				id: NodeIds.CreateCausalGraph,
				value: NodeIds.CreateCausalGraph,
				name: NodeIds.CreateCausalGraph,
			}
		case GraphNodeType.LoadDataset:
			return {
				type: GraphNodeType.LoadDataset,
				id: NodeIds.LoadDataset,
				value: NodeIds.LoadDataset,
				name: NodeIds.LoadDataset,
			}
		case GraphNodeType.SignificanceTest:
			return {
				type: GraphNodeType.SignificanceTest,
				result: 'significance_test',
				id: NodeIds.SignificanceTest,
				value: NodeIds.SignificanceTest,
				name: NodeIds.SignificanceTest,
			}
	}
}
