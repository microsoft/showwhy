/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { VariableDefinition } from './VariableDefinition'
import { Maybe } from '../primitives'

export interface Definition {
	population?: VariableDefinition[]
	exposure?: VariableDefinition[]
	outcome?: VariableDefinition[]
	control?: VariableDefinition[]
	[key: string]: Maybe<VariableDefinition[]>
}
