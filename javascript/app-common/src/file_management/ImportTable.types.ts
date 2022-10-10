/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { DataFormat, DataShape, ParserOptions } from '@datashaper/schema'
import type { TableContainer } from '@datashaper/tables'

export type OpenTableHandler = (
	table: TableContainer,
	fileType: DataFormat,
	parserOptions: ParserOptions,
	shape: DataShape,
) => void
