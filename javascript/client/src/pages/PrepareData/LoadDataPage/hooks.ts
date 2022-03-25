/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import { guessDelimiter } from '@data-wrangling-components/utilities'
import type { IDropdownOption } from '@fluentui/react'
import type { Handler, Handler1, Maybe } from '@showwhy/types'
import { useBoolean } from 'ahooks'
import { useCallback, useEffect, useState } from 'react'
import type { SetterOrUpdater } from 'recoil'
import { v4 as uuidv4 } from 'uuid'

import { useGlobalDropzone, useOnDropAccepted } from '~hooks'
import {
	useAddProjectFile,
	useProjectFiles,
	useSelectedFile,
	useSetProjectFiles,
	useSetSelectedFile,
} from '~state'
import type { DropFilesCount, ProjectFile } from '~types'
import { createDefaultTable, replaceItemAtIndex, wait } from '~utils'

export function useBusinessLogic(): {
	showConfirm: boolean
	errorMessage: Maybe<string> | null
	selectedFile: Maybe<ProjectFile>
	projectFiles: ProjectFile[]
	selectedDelimiter: Maybe<string>
	loading: boolean
	fileCount: DropFilesCount
	acceptedFileTypes: string[]
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>
	toggleShowConfirm: Handler
	toggleLoadedCorrectly: Handler
	handleDismissError: Handler
	handleDelimiterChange: (e: unknown, option: Maybe<IDropdownOption>) => void
	handleOnDropAccepted: (f: FileCollection) => void
	onConfirmDelete: Handler
	onRenameTable: (alias: string) => void
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
	progress?: number
} {
	const setSelectedFile = useSetSelectedFile()
	const selectedFile = useSelectedFile()
	const projectFiles = useProjectFiles()
	const setProjectFiles = useSetProjectFiles()
	const [errorMessage, setErrorMessage] = useState<string | null>()
	const [selectedDelimiter, setSelectedDelimiter] = useState<Maybe<string>>()
	const [showConfirm, { toggle: toggleShowConfirm }] = useBoolean(false)

	const handleDismissError = useCallback(() => {
		setErrorMessage('')
	}, [setErrorMessage])

	const handleOnDropAccepted = useOnDropAccepted(setErrorMessage)

	// TODO: this should be tracked as part of the file management
	useEffect(() => {
		if (selectedFile && selectedFile.loadedCorrectly) {
			const delimiter = guessDelimiter(selectedFile.name)
			setSelectedDelimiter(delimiter)
		}
	}, [selectedFile, setSelectedDelimiter])
	useDefaultSelectedFile(selectedFile, projectFiles, setSelectedFile)

	const toggleLoadedCorrectly = useToggleLoadedCorrectly(
		selectedFile,
		projectFiles,
		setProjectFiles,
		setSelectedFile,
	)

	const onConfirmDelete = useOnConfirmDelete(
		projectFiles,
		selectedFile,
		setProjectFiles,
		toggleShowConfirm,
		setSelectedFile,
	)

	const updateProjectFiles = useCallback(
		(file: ProjectFile) => {
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setSelectedFile(file)
			setProjectFiles(files)
		},
		[projectFiles, setSelectedFile, setProjectFiles],
	)

	const handleDelimiterChange = useCallback(
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

	const handleLoadFile = useHandleLoadFile(setErrorMessage)

	const {
		onDrop,
		onDropAccepted,
		onDropRejected,
		loading,
		fileCount,
		acceptedFileTypes,
		progress,
	} = useGlobalDropzone(setErrorMessage, handleLoadFile)

	const onRenameTable = useCallback(
		(alias: string) => {
			const file = {
				...selectedFile,
				alias: alias,
			} as ProjectFile
			updateProjectFiles(file)
		},
		[selectedFile, updateProjectFiles],
	)
	return {
		showConfirm,
		errorMessage,
		selectedFile,
		projectFiles,
		selectedDelimiter,
		onConfirmDelete,
		setSelectedFile,
		toggleShowConfirm,
		toggleLoadedCorrectly,
		handleDelimiterChange,
		onRenameTable,
		loading,
		fileCount,
		handleDismissError,
		acceptedFileTypes,
		handleOnDropAccepted,
		onDrop,
		onDropAccepted,
		onDropRejected,
		progress,
	}
}

function useToggleLoadedCorrectly(
	selectedFile: Maybe<ProjectFile>,
	projectFiles: ProjectFile[],
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
) {
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

function useDefaultSelectedFile(
	current: Maybe<ProjectFile>,
	files: ProjectFile[],
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
) {
	useEffect(() => {
		if (!current) {
			const [file] = files
			if (file && file.loadedCorrectly === undefined) {
				file.loadedCorrectly = true
			}
			setSelectedFile(file)
		}
	}, [files, current, setSelectedFile])
}

function useOnConfirmDelete(
	projectFiles: ProjectFile[],
	selectedFile: Maybe<ProjectFile>,
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	toggleShowConfirm: (value?: boolean) => void,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
) {
	return useCallback(() => {
		const filteredFiles = projectFiles.filter(p => p.id !== selectedFile?.id)
		setProjectFiles(filteredFiles)
		setSelectedFile(undefined)
		toggleShowConfirm()
	}, [
		projectFiles,
		selectedFile,
		setProjectFiles,
		toggleShowConfirm,
		setSelectedFile,
	])
}

function useHandleLoadFile(setErrorMessage: Handler1<string>) {
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
				await wait(500)
				setSelectedFile(file)
			}
		},
		[addFile, projectFiles, setErrorMessage, setSelectedFile],
	)
}
