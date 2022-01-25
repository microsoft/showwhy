/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { ElementDefinition } from './ElementDefinition'

export interface Element {
	label: string
	description: string
	definition: ElementDefinition[]
	dataset?: string
	variable?: string
}
