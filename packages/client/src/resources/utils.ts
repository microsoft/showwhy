/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EstimatorsGroups,
	EstimatorsType,
	NodeIds,
	NodeTypes,
	RefutationTypes,
} from '~enums'
import { NodeData } from '~interfaces'

export function getSimulationNumByRefuterType(type: RefutationTypes): number {
	switch (type) {
		case RefutationTypes.FullRefutation:
			return 100
		case RefutationTypes.QuickRefutation:
		default:
			return 10
	}
}

export function getModelTypeByEstimatorGroup(group: EstimatorsGroups): string {
	switch (group) {
		case EstimatorsGroups.ExposureEstimator:
			return 'Treatment Assignment Model'
		case EstimatorsGroups.OutcomeEstimator:
			return 'Outcome Model'
	}
}

export function getModelNameByEstimatorType(type: EstimatorsType): string {
	switch (type) {
		case EstimatorsType.ForestDoubleMachineLearning:
			return 'econml.dml.CausalForestDML'
		case EstimatorsType.LinearDoubleMachineLearning:
			return 'econml.dml.LinearDML'
		case EstimatorsType.ForestDoublyRobustLearner:
			return 'econml.dr.ForestDRLearner'
		case EstimatorsType.LinearDoublyRobustLearner:
			return 'econml.dr.LinearDRLearner'
		case EstimatorsType.LinearRegression:
			return 'linear_regression'
		case EstimatorsType.PropensityScoreMatching:
			return 'propensity_score_matching'
		case EstimatorsType.PropensityScoreStratification:
			return 'propensity_score_stratification'
		case EstimatorsType.InversePropensityWeighting:
			return 'propensity_score_weighting'
	}
}

export function getNodeProperties(type: NodeTypes): NodeData {
	switch (type) {
		case NodeTypes.EstimateEffects:
			return {
				type: NodeTypes.EstimateEffects,
				result: 'estimate_results',
				id: NodeIds.EstimateEffects,
				value: NodeIds.EstimateEffects,
				name: NodeIds.EstimateEffects,
			}
		case NodeTypes.IdentifyEstimand:
			return {
				type: NodeTypes.IdentifyEstimand,
				result: 'primary_estimand',
				id: NodeIds.IdentifyEstimand,
				value: NodeIds.IdentifyEstimand,
				name: NodeIds.IdentifyEstimand,
			}
		case NodeTypes.CreateCausalGraph:
			return {
				type: NodeTypes.CreateCausalGraph,
				result: 'primary_maximum_model',
				id: NodeIds.CreateCausalGraph,
				value: NodeIds.CreateCausalGraph,
				name: NodeIds.CreateCausalGraph,
			}
		case NodeTypes.LoadDataset:
			return {
				type: NodeTypes.LoadDataset,
				id: NodeIds.LoadDataset,
				value: NodeIds.LoadDataset,
				name: NodeIds.LoadDataset,
			}
		case NodeTypes.SignificanceTest:
			return {
				type: NodeTypes.SignificanceTest,
				result: 'significance_test',
				id: NodeIds.SignificanceTest,
				value: NodeIds.SignificanceTest,
				name: NodeIds.SignificanceTest,
			}
	}
}

export function localhostUrl(url: string): string {
	return url.replace('http://functions/', 'http://localhost:81/')
}
