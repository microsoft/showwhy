/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { CausalFactor, ElementDefinition } from '~types'

export interface DefinitionArgs {
	onSelect: (id: string) => void
	definition?: ElementDefinition | CausalFactor
}
