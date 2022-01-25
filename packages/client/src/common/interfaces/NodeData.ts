/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { AdditionalProperties } from '~interfaces'

export interface NodeData extends AdditionalProperties {
	type: string
	id: string
	value: string
	name: string
	result?: string
}
