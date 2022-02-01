/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ExposureAndOutcomeCauses } from './Causes'
import { ElementDefinition } from '../experiments'
export interface CausalFactor extends ElementDefinition {
	causes?: ExposureAndOutcomeCauses
}
