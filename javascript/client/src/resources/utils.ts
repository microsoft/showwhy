/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { GraphNodeData, GraphNodeType } from '@showwhy/api-client'
import { RefutationType, EstimatorGroup, EstimatorType } from '~types'

export enum NodeIds {
	IdentifyEstimand = 'Identify Estimand',
	CreateCausalGraph = 'Create Causal Graph',
	LoadDataset = 'Load Dataset',
	EstimateEffects = 'Estimate Effects',
	SignificanceTest = 'Significance Test',
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
