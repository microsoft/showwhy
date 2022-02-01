/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Maybe } from '../primitives'
import { VariableDefinition } from './VariableDefinition'

export interface Definition {
	population?: VariableDefinition[]
	exposure?: VariableDefinition[]
	outcome?: VariableDefinition[]
	control?: VariableDefinition[]
	[key: string]: Maybe<VariableDefinition[]>
}
