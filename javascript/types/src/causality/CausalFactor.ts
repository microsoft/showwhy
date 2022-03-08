/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElementDefinition } from '../experiments/index.js'
import type { ExposureAndOutcomeCauses } from './Causes.js'
export interface CausalFactor extends ElementDefinition {
	causes?: ExposureAndOutcomeCauses
}
