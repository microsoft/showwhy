/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Dispatch, SetStateAction } from 'react'

export type Setter<T> = Dispatch<SetStateAction<T>>
