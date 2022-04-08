/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { wait } from '@showwhy/api-client'
import type { AsyncHandler1, Handler, Handler1 } from '@showwhy/types'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useAddProjectFile, useProjectFiles, useSetSelectedFile } from '~state'
import type { ProjectFile } from '~types'

export function useHandleLoadFile(
	setErrorMessage: Handler1<string>,
	onLoad: Handler,
): AsyncHandler1<ProjectFile> {
	const projectFiles = useProjectFiles()
	const addFile = useAddProjectFile()
	const setSelectedFile = useSetSelectedFile()
	return useCallback(
		async (file: ProjectFile) => {
			if (projectFiles.find(s => s.name === file.name)) {
				setErrorMessage('File already uploaded')
			} else {
				const fileId = uuidv4()
				file.id = fileId
				file.loadedCorrectly = true
				addFile(file)
				onLoad()
				await wait(500)
				setSelectedFile(file)
			}
		},
		[addFile, projectFiles, setErrorMessage, setSelectedFile, onLoad],
	)
}
