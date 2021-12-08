/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType, Hypothesis } from '../enums'

export interface ElementDefinition {
	id: string
	description: string
	level: DefinitionType
	variable?: string
	column?: string
}

export interface Element {
	label: string
	description: string
	definition: ElementDefinition[]
	dataset?: string
	variable?: string
}

export interface DescribeElements {
	population: Element
	exposure: Element
	outcome: Element
	hypothesis: Hypothesis
}
