/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalModelLevel } from '~enums'
import { EstimatorType } from '~interfaces'

export interface PrimarySpecificationConfig {
	causalModel: CausalModelLevel
	type: EstimatorType
}
