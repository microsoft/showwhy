/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactor, ElementDefinition } from '~types'
import { Handler, Handler1, Maybe } from '../primitives'

export interface DefinitionActions {
	onDelete: Handler
	onSave: Handler1<ElementDefinition | CausalFactor>
	onSaveCallout: Handler1<Maybe<string>>
}
