/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Definition, Factor } from '~interfaces'
import { Setter } from '~types'

export type InputRef = React.RefObject<HTMLInputElement>

export type SetModelVariables = Setter<Definition | undefined>

export type SetEditingDefinition = Setter<Factor | undefined>
