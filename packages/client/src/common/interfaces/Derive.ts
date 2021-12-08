/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DeriveTypes } from '../enums/DeriveTypes'

export interface Derive {
	id: string
	column: string
	columnName: string
	threshold: number
	type: DeriveTypes
}
