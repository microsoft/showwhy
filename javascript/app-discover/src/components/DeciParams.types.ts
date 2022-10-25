/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DECIParams } from '../domain/Algorithms/DECI.js'

export type onChangeStringFn = (
	key: keyof DECIParams,
	val?: string | undefined,
	name?: string | undefined,
) => void | undefined

export type onChangeBooleanFn = (
	key: keyof DECIParams,
	val?: boolean | undefined,
	name?: string | undefined,
) => void | undefined
