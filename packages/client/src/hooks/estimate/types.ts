/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { SetterOrUpdater } from 'recoil'
import { NodeResponse, RunHistory } from '~interfaces'
import { Setter } from '~types'

export type SetRunHistory = SetterOrUpdater<RunHistory[]>

export type SetNodeResponse = SetterOrUpdater<NodeResponse | undefined>

export type SetBoolean = Setter<boolean>
