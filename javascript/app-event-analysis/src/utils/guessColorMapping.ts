/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ColumnMapping } from '../types.js'
import { POSSIBLE_COL_NAMES } from '../types.js'

export function guessColMapping(columns: string[]): ColumnMapping {
	// NOTE: the use of 'unit', 'Unit', or 'State' as possible column names
	//  Such code is used in an attempt to guess and automatically set the unitColSelection
	//  from the input data, and thus saves the user the need to explicitly select that
	const unit =
		columns.find(colName => POSSIBLE_COL_NAMES.unit.includes(colName)) || ''
	const date =
		columns.find(colName => POSSIBLE_COL_NAMES.date.includes(colName)) || ''
	const treated =
		columns.find(colName => POSSIBLE_COL_NAMES.treated.includes(colName)) || ''
	const value =
		columns.find(colName => POSSIBLE_COL_NAMES.value.includes(colName)) || ''
	return {
		unit,
		date,
		treated,
		value,
	}
}
