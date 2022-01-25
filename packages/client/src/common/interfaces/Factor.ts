/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType } from '~enums'
import { Causes } from './Causes'

export interface Factor {
	id: string
	description?: string
	variable: string
	causes?: Causes
	column?: string
	level?: DefinitionType
}
