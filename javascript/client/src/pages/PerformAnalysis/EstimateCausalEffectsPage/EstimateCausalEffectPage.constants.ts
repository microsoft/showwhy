/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

// these functions hard-code data columns in the current model
// it is possible we may want more flexibility/configurability/discoverability
// in the future
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

export const OUTPUT_FILE_NAME = 'output'
