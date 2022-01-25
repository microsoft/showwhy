/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { FilterObject } from '../filters'

export interface VariableDefinition {
	name: string
	filters: FilterObject[]
}
