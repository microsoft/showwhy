/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '../primitives.js'
import type { VariableDefinition } from './VariableDefinition.js'

export interface Definition {
	population?: VariableDefinition[]
	exposure?: VariableDefinition[]
	outcome?: VariableDefinition[]
	control?: VariableDefinition[]
	[key: string]: Maybe<VariableDefinition[]>
}
