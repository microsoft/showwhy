/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { BasicTable, CausalFactor, ElementDefinition } from '~interfaces'
import { Setter } from '~types'

export type FactorsOrDefinitions = CausalFactor[] | ElementDefinition[]

export type SetTableIdentifier = Setter<BasicTable>
