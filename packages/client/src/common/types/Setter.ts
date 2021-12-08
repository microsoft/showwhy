/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import React from 'react'

export type Setter<T> = React.Dispatch<React.SetStateAction<T | undefined>>

export type StringSetter = Setter<string>
