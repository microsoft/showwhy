/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactor, Definition, ElementDefinition } from '~interfaces'
import { Setter } from '~types'

export type InputRef = React.RefObject<HTMLInputElement>

export type SetModelVariables = Setter<Definition>

export type SetEditingDefinition = Setter<CausalFactor | ElementDefinition>
