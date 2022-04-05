/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Maybe } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import type { ProjectFile } from '~types'
import { replaceItemAtIndex } from '~utils'

export function useToggleLoadedCorrectly(
	selectedFile: Maybe<ProjectFile>,
	projectFiles: ProjectFile[],
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
): (delimiter?: string) => void {
	return useCallback(
		(delimiter?: string) => {
			const stateNow = selectedFile?.loadedCorrectly || false
			const file = {
				...selectedFile,
				loadedCorrectly: !stateNow,
				delimiter,
			} as ProjectFile
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setProjectFiles(files)
			setSelectedFile(file)
		},
		[selectedFile, projectFiles, setProjectFiles, setSelectedFile],
	)
}
