/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { ElementDefinition } from '../experiments'
import type { ExposureAndOutcomeCauses } from './Causes'
export interface CausalFactor extends ElementDefinition {
	causes?: ExposureAndOutcomeCauses
}
