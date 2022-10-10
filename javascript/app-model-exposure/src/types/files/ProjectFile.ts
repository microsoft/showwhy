/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type ColumnTable from 'arquero/dist/types/table/column-table'

export interface ProjectFile {
	name: string
	alias?: string
	table: ColumnTable
	id?: string
	loadedCorrectly?: boolean
	delimiter?: string
	autoType?: boolean
}
