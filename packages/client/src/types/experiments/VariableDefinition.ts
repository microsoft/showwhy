/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Step } from '@data-wrangling-components/core'

export interface VariableDefinition {
	id: string
	steps: Step[]
}
