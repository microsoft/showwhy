/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalityLevel } from '../causality/index.js'

export interface ElementDefinition {
	id: string
	description: string
	variable: string
	column?: string
	level: CausalityLevel
	type?: string
}
