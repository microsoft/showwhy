/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalityLevel } from '../causality'

export interface ElementDefinition {
	id: string
	description: string
	level: CausalityLevel
	variable?: string
	column?: string
}
