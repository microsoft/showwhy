/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Definition } from '../experiments/Definition.js'
import type { Cause } from './Cause.js'
export interface CausalFactor extends Definition {
	causes?: Cause
}
