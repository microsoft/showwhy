/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import type { Maybe, ProjectFile } from '@showwhy/types'
import { useCallback } from 'react'

import { createDefaultTable } from '~utils'

export function useHandleDelimiterChange(
	selectedFile: Maybe<ProjectFile>,
	setSelectedDelimiter: (a: string) => void,
	updateProjectFiles: (file: ProjectFile) => void,
	toggleLoadedCorrectly: (delimiter?: string | undefined) => void,
) {
	return useCallback(
		(_e, option: Maybe<IDropdownOption>): void => {
			const delimiter = `${option?.key}`
			if (selectedFile && selectedFile.id) {
				const table = createDefaultTable(selectedFile.table.toCSV(), delimiter)
				const file = {
					...selectedFile,
					table,
				} as ProjectFile
				updateProjectFiles(file)
				toggleLoadedCorrectly(delimiter)
			}
			setSelectedDelimiter(delimiter)
		},
		[
			setSelectedDelimiter,
			selectedFile,
			updateProjectFiles,
			toggleLoadedCorrectly,
		],
	)
}
