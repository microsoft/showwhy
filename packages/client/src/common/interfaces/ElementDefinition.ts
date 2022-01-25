/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType } from '../enums'

export interface ElementDefinition {
	id: string
	description: string
	level: DefinitionType
	variable?: string
	column?: string
}
