/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@data-wrangling-components/core'
import { useMemo } from 'react'
import { useProjectFiles } from '~state'

export function useTables(): TableContainer[] {
	const projectFiles = useProjectFiles()

	return useMemo((): TableContainer[] => {
		return projectFiles.map(f => {
			return {
				id: f.id,
				name: f.name,
				table: f.table,
			} as TableContainer
		})
	}, [projectFiles])
}
