/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'

export interface ProjectFile {
	name: string
	content: string
	alias?: string
	table: ColumnTable
	id?: string
	loadedCorrectly?: boolean
	fileId?: string //why id and fileId?
}
