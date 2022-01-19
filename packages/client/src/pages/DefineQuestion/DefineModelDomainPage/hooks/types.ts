/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { ElementDefinition } from '~interfaces'
import { Setter } from '~types'

export type SetDefinitions = Setter<ElementDefinition[] | undefined>

export type SetDefinition = Setter<ElementDefinition | undefined>
