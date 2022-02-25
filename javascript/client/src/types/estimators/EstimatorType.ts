/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum EstimatorType {
	LinearDoubleMachineLearning = 'Linear Double Machine Learning',
	ForestDoubleMachineLearning = 'Forest Double Machine Learning',
	ForestDoublyRobustLearner = 'Forest Doubly Robust Learner',
	LinearDoublyRobustLearner = 'Linear Doubly Robust Learner',
	PropensityScoreStratification = 'Propensity Score Stratification',
	InversePropensityWeighting = 'Inverse Propensity Weighting',
	PropensityScoreMatching = 'Propensity Score Matching',
	LinearRegression = 'Linear Regression',
}
