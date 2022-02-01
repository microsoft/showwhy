/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'
import { FilterObject } from '../filters'

export interface VariableDefinition {
	name: string
	filters: FilterObject[]
}

export interface VariableDefinition1 {
	id: string
	steps: Step[]
}
