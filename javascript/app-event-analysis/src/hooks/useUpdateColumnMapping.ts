/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { isEqual } from 'lodash'
import { useCallback } from 'react'

import { useColumnMappingState } from '../state/ColumnMapping.js'
import type { ColumnMapping } from '../types.js'

export function useUpdateColumnMapping() {
	const [columnMapping, setColumnMapping] = useColumnMappingState()

	return useCallback(
		(mapping: ColumnMapping) => {
			const newMapping = { ...columnMapping, ...mapping }
			if (isEqual(newMapping, columnMapping)) return
			setColumnMapping(newMapping)
		},
		[columnMapping, setColumnMapping],
	)
}
