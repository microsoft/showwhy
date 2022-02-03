/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactor, ElementDefinition } from '~types'

export interface DefinitionActions {
	onDelete: () => void
	onSave: (definitionToSave: ElementDefinition | CausalFactor) => void
	onSaveCallout: (name?: string) => void
}
