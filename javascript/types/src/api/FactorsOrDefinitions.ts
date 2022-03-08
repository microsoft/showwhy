/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '../causality/index.js'
import type { ElementDefinition } from '../experiments/index.js'

export type FactorsOrDefinitions = CausalFactor[] | ElementDefinition[]
