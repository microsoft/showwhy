/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { VariableAssignedCount } from '.'
import { CausalFactor, ElementDefinition, Maybe } from '~types'

export interface DefinitionArgs {
	onSelect: (id: string) => void
	definition?: ElementDefinition | CausalFactor
	assignedCount: Maybe<VariableAssignedCount>
}
