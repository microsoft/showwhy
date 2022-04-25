/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileType } from '@data-wrangling-components/utilities'
import type { Handler, Handler1, ProjectFile } from '@showwhy/types'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'

import { useHandleFiles } from '~hooks'
import { useProjectFiles, useSelectedFile, useSetProjectFiles } from '~state'
import { replaceItemAtIndex } from '~utils'

const acceptedFileTypes: string[] = [
	`.${FileType.csv}`,
	`.${FileType.tsv}`,
	`.${FileType.zip}`,
]

export function useFileManagement(setErrorMessage: Handler1<string>): {
	projectFiles: ProjectFile[]
	doRemoveFile: Handler
	doUpdateFiles: (file: ProjectFile) => void
	onFileLoad: (file: ProjectFile) => void
	selectedFile: ProjectFile | undefined
	setSelectedFile: Handler1<ProjectFile>
	onZipFileLoad: (fileCollection: FileCollection) => void
	acceptedFileTypes: string[]
} {
	const projectFiles = useProjectFiles()
	const setProjectFiles = useSetProjectFiles()
	const [selectedFile, setSelectedFile] = useSelectedFile()

	const doUpdateFiles = useCallback(
		(file: ProjectFile) => {
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setSelectedFile(file)
			setProjectFiles(files)
		},
		[projectFiles, setSelectedFile, setProjectFiles],
	)

	const onFileLoad = useCallback(
		async (file: ProjectFile) => {
			if (projectFiles.find(s => s.name === file.name)) {
				setErrorMessage && setErrorMessage('File already uploaded')
				return null
			}
			const fileId = uuidv4()
			file.id = fileId
			file.loadedCorrectly = true
			setProjectFiles([...projectFiles, file])
			setSelectedFile(file)
		},
		[projectFiles, setSelectedFile, setProjectFiles, setErrorMessage],
	)

	const doRemoveFile = useCallback(() => {
		const filteredFiles = projectFiles.filter(p => p.id !== selectedFile?.id)
		setProjectFiles(filteredFiles)
	}, [selectedFile, setProjectFiles, projectFiles])

	const onZipFileLoad = useHandleFiles(setErrorMessage)

	return {
		projectFiles,
		doRemoveFile,
		onFileLoad,
		doUpdateFiles,
		selectedFile,
		setSelectedFile,
		onZipFileLoad,
		acceptedFileTypes,
	}
}
