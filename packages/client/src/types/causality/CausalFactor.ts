/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ElementDefinition } from '../experiments'
import { ExposureAndOutcomeCauses } from './Causes'

export interface CausalFactor extends ElementDefinition {
	causes?: ExposureAndOutcomeCauses
}
