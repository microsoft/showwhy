/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { Estimators } from '../types'
import type { EstimatorsKeyString as EstimatorsString } from '../types.js'

export function getEstimatorLabel(key: EstimatorsString) {
	return Estimators[key]
}
