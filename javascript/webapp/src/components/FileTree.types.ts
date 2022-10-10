/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, ParserOptions } from '@datashaper/schema'
import type { DataShape } from '@datashaper/schema/dist/datatable/DataShape.js'
import type { TableContainer } from '@datashaper/tables'
import type { BaseFile } from '@datashaper/utilities'

export interface FileTreeTypes {
	style?: React.CSSProperties
	className?: string
	selectedFileId?: string
}

export type AddTableHandler = (
	parser: ParserOptions,
	file: BaseFile,
	table: TableContainer,
	fileType: DataFormat,
	shape: DataShape,
) => void
