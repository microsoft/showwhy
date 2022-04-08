/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AsyncHandler1, Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { ProjectFile } from '~types'
import { createDefaultTable, replaceItemAtIndex } from '~utils'

export function useToggleAutoType(
	selectedFile: Maybe<ProjectFile>,
	projectFiles: ProjectFile[],
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
): AsyncHandler1<boolean> {
	return useCallback(
		async (autoType: boolean) => {
			const table = createDefaultTable(
				selectedFile?.table?.toCSV() || '',
				selectedFile?.delimiter,
				undefined,
				autoType,
			)
			const file = {
				...selectedFile,
				table,
				autoType,
			} as ProjectFile
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setProjectFiles(files)
			setSelectedFile(file)
		},
		[selectedFile, projectFiles, setProjectFiles, setSelectedFile],
	)
}
