/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export const FEATURE_COLUMNS = [
	'causalModel',
	'estimator',
	'population',
	'treatment',
]

export const SHAP_COLUMNS = [
	'causalModelSHAP',
	'estimatorSHAP',
	'populationSHAP',
	'treatmentSHAP',
]

/**
 * Returns the standard columns to plot for specification features.
 * @returns
 */
export function useSpecificationFeatureColumns(): string[] {
	return FEATURE_COLUMNS
}

/**
 * Returns the standard columns to plot for SHAP model influence of features.
 * @returns
 */
export function useSpecificationSHAPColumns(): string[] {
	return SHAP_COLUMNS
}
