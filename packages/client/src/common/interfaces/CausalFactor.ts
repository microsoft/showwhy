/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Causes } from './Causes'

export interface CausalFactor {
	id: string
	description?: string
	variable: string
	causes?: Causes
	column?: string
}
