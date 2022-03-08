/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FilterObject } from '../filters/index.js'

export interface VariableDefinition {
	name: string
	filters: FilterObject[]
}
