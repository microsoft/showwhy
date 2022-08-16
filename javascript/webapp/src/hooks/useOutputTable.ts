/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'

import { useOutputTables, useProjectFiles } from '~state'

export function useOutputTable(): Maybe<ColumnTable> {
	const output = useOutputTables()
	const files = useProjectFiles()
	const outputLen = output.length
	if (outputLen > 0) {
		return output[outputLen - 1]?.table
	} else if (files.length === 1) {
		return files[0]?.table
	}
	return undefined
}
