/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface RobustLearnerModel {
	id: string
	min_propensity: number
	max_depth: number
	min_samples_leaf: number
	num_estimators: number
}
