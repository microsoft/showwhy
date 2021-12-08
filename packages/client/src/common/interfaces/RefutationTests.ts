/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RefutationTestMethod } from '~enums'

export interface RefutationOption {
	method_name: RefutationTestMethod
	label: string
	checked?: boolean
	helpText?: string
	description?: string
	median_change?: string
}
