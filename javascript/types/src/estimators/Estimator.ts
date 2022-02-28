/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatorGroup } from './EstimatorGroup'
import type { EstimatorType } from './EstimatorType'

export interface Estimator {
	group: EstimatorGroup
	type: EstimatorType
}
