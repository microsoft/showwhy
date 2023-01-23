/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DECIAlgorithmParams } from '../domain/Algorithms/DECI.js'

export type onChangeStringFn = (
	key: keyof DECIAlgorithmParams,
	val?: string | undefined,
	name?: string | undefined,
) => void | undefined

export type onChangeBooleanFn = (
	key: keyof DECIAlgorithmParams,
	val?: boolean | undefined,
	name?: string | undefined,
) => void | undefined
