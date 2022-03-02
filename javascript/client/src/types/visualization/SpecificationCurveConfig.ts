/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export interface SpecificationCurveConfig {
	medianLine?: boolean
	meanLine?: boolean
	shapTicks?: boolean
	confidenceIntervalTicks?: boolean
	/**
	 * This is the list of decision features that have been excluded by the user
	 */
	inactiveFeatures?: string[]
	/**
	 * This is the list of decision features that have been excluded by the user
	 */
	inactiveSpecifications?: number[]
}
