/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { VariableDefinition } from './VariableDefinition'
import type { Maybe } from '@showwhy/types'

export interface Definition {
	population?: VariableDefinition[]
	exposure?: VariableDefinition[]
	outcome?: VariableDefinition[]
	control?: VariableDefinition[]
	[key: string]: Maybe<VariableDefinition[]>
}
