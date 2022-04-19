/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { IDropdownOption } from '@fluentui/react'
import type { Maybe, ProjectFile } from '@showwhy/types'
import type { FormEvent } from 'react'
import { useCallback } from 'react'

import { createDefaultTable } from '~utils'

export function useHandleDelimiterChange(
	setSelectedDelimiter: (a: string) => void,
	selectedFile: Maybe<ProjectFile>,
	doUpdateFiles: (file: ProjectFile) => void,
	toggleLoadedCorrectly: (delimiter?: string | undefined) => void,
): (_e: FormEvent<HTMLDivElement>, option: Maybe<IDropdownOption>) => void {
	return useCallback(
		(_e: FormEvent<HTMLDivElement>, option: Maybe<IDropdownOption>): void => {
			const delimiter = `${option?.key}`
			if (selectedFile && selectedFile.id) {
				const table = createDefaultTable(selectedFile.table.toCSV(), delimiter)
				const file = {
					...selectedFile,
					table,
				} as ProjectFile
				doUpdateFiles(file)
				toggleLoadedCorrectly(delimiter)
			}
			setSelectedDelimiter(delimiter)
		},
		[setSelectedDelimiter, selectedFile, doUpdateFiles, toggleLoadedCorrectly],
	)
}
