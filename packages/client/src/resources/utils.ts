/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	EstimatorGroup,
	EstimatorType,
	NodeIds,
	NodeTypes,
	RefutationType,
} from '~enums'
import { NodeData } from '~interfaces'
import { getEnv } from '~resources/getEnv'

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

export const replaceAzureUrl = (url: string): string => {
	const { BASE_URL } = getEnv()
	const regExp = new RegExp(/^https?:\/\/azurite:10000/)
	return url.replace(regExp, BASE_URL)
}
