/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RefutationTestMethod } from './RefutationTestMethod.js'

export interface RefutationOption {
	method_name: RefutationTestMethod
	label: string
	checked?: boolean
	helpText?: string
	description?: string
	median_change?: string
}
