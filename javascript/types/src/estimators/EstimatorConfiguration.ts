/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum EstimatorConfiguration {
	trimmingLevel = 'trimming_level',
	weightingMethods = 'weighting_scheme',
	minPropensity = 'min_propensity',
	maxDepth = 'max_depth',
	minSamplesLeaf = 'min_samples_leaf',
	numEstimators = 'num_estimators',
	numBins = 'num_strata',
	clippingThreshold = 'clipping_threshold',
	algorithm = 'algorithm',
	maxDistance = 'max_distance',
}
