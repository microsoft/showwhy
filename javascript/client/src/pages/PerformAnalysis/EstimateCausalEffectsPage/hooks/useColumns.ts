/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FEATURE_COLUMNS,
	SHAP_COLUMNS,
} from '../EstimateCausalEffectPage.constants'

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
