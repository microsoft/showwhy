/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { TableContainer } from '@data-wrangling-components/core'
import type { FileWithPath } from '@data-wrangling-components/utilities'
import {
	createFileWithPath,
	guessDelimiter,
} from '@data-wrangling-components/utilities'
import { useCallback } from 'react'

import { useAddFilesToCollection } from '../../../../hooks'
import { useAddProjectFile } from '../../../../state'
import type { ProjectFile } from '../../../../types'

export function useOnUpdateTables(): (tables: TableContainer[]) => void {
	const addProjectFile = useAddProjectFile()
	const addFilesToCollection = useAddFilesToCollection()
	return useCallback(
		async (tables: TableContainer[]) => {
			const tableFile = (t: TableContainer, name?: string) =>
				t.table
					? createFileWithPath(new Blob([t.table.toCSV()]), {
							name: name || t.name || t.id,
					  })
					: null

			if (tables.length) {
				tables.forEach(t => {
					const fp = {
						...t,
						delimiter: guessDelimiter(t.name || t.id),
						content: t.table?.toCSV() || '',
					} as ProjectFile
					addProjectFile(fp)
				})

				const files = tables
					.map(table => tableFile(table))
					.filter(f => f !== null)
				if (files.length) {
					await addFilesToCollection(files as FileWithPath[])
				}
			}
		},
		[addProjectFile, addFilesToCollection],
	)
}
