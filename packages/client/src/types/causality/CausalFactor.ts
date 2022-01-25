/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalityLevel } from './CausalityLevel'
import { ExposureAndOutcomeCauses } from './Causes'

export interface CausalFactor {
	id: string
	description?: string
	variable: string
	causes?: ExposureAndOutcomeCauses
	column?: string
	level?: CausalityLevel
}
