/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export interface FilterObject {
	id: string
	value?: string | number
	filter?: string
	column?: string
	lower?: number
	upper?: number
	tableId?: string
	inclusive?: boolean
	columnName?: string
}
