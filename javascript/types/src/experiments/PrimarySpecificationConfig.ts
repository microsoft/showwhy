/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalModelLevel } from '../causality/index.js'
import type { EstimatorType } from '../estimators/index.js'

export interface PrimarySpecificationConfig {
	causalModel: CausalModelLevel
	type: EstimatorType
}
