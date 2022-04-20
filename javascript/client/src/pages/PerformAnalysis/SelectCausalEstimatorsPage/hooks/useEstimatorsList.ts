/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Estimator } from '@showwhy/types'

import { ESTIMATORS } from '../SelectCausalEstimatorsPage.constants'

export function useEstimatorsList(): Estimator[] {
	return ESTIMATORS
}
