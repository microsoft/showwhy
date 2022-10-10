/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatorGroup } from './EstimatorGroup.js'
import type { EstimatorType } from './EstimatorType.js'

export interface Estimator {
	group: EstimatorGroup
	type: EstimatorType
	confidenceInterval?: boolean
	refutations?: number
}
