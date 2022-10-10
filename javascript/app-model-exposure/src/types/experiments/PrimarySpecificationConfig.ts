/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalModelLevel } from '../causality/CausalModelLevel.js'
import type { EstimatorType } from '../estimators/EstimatorType.js'

export interface PrimarySpecificationConfig {
	causalModel: CausalModelLevel
	type: EstimatorType
}
