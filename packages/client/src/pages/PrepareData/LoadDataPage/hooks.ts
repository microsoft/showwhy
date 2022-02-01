/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	guessDelimiter,
} from '@data-wrangling-components/utilities'
import { IDropdownOption } from '@fluentui/react'
import { useBoolean } from 'ahooks'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'
import { SetterOrUpdater } from 'recoil'
import { v4 as uuidv4 } from 'uuid'
import { useGlobalDropzone, useOnDropAccepted } from '~hooks'
import {
	useAddProjectFile,
	useProjectFiles,
	useSelectedFile,
	useSelectOriginalTable,
	useSetOrUpdateOriginalTable,
	useSetProjectFiles,
	useSetSelectedFile,
} from '~state'
import { DropFilesCount, ProjectFile, Handler1, Maybe } from '~types'
import { createDefaultTable, replaceItemAtIndex } from '~utils'

export function useBusinessLogic(): {
	showConfirm: boolean
	errorMessage: Maybe<string> | null
	selectedFile: Maybe<ProjectFile>
	projectFiles: ProjectFile[]
	originalTable: ColumnTable
	selectedDelimiter: Maybe<string>
	loading: boolean
	fileCount: DropFilesCount
	acceptedFileTypes: string[]
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>
	toggleShowConfirm: () => void
	toggleLoadedCorrectly: () => void
	handleDismissError: () => void
	handleDelimiterChange: (
		e: unknown,
		option: IDropdownOption | undefined,
	) => void
	handleOnDropAccepted: (f: FileCollection) => void
	onConfirmDelete: () => void
	onRenameTable: (alias: string) => void
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
} {
	const setSelectedFile = useSetSelectedFile()
	const selectedFile = useSelectedFile()
	const projectFiles = useProjectFiles()
	const setProjectFiles = useSetProjectFiles()
	const [errorMessage, setErrorMessage] = useState<string | null>()
	const [selectedDelimiter, setSelectedDelimiter] = useState<Maybe<string>>()
	const [showConfirm, { toggle: toggleShowConfirm }] = useBoolean(false)
	const originalTableState = useSelectOriginalTable(selectedFile?.id as string)
	const originalTable = originalTableState()?.table

	const handleDismissError = useCallback(() => {
		setErrorMessage('')
	}, [setErrorMessage])

	const addOriginalTable = useSetOrUpdateOriginalTable()
	const handleOnDropAccepted = useOnDropAccepted(setErrorMessage)

	// TODO: this should be tracked as part of the file management
	useEffect(() => {
		if (selectedFile) {
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

	const handleDelimiterChange = useCallback(
		(e, option: IDropdownOption | undefined): void => {
			const delimiter = `${option?.key}`
			if (selectedFile && selectedFile.id) {
				const table = createDefaultTable(selectedFile.content, delimiter)
				addOriginalTable({ tableId: selectedFile.id, table })
			}
			setSelectedDelimiter(delimiter)
		},
		[setSelectedDelimiter, selectedFile, addOriginalTable],
	)

	const handleLoadFile = useHandleLoadFile(setErrorMessage)

	const {
		onDrop,
		onDropAccepted,
		onDropRejected,
		loading,
		fileCount,
		acceptedFileTypes,
	} = useGlobalDropzone(setErrorMessage, handleLoadFile)

	const onRenameTable = useCallback(
		(alias: string) => {
			const file = {
				...selectedFile,
				alias: alias,
			} as ProjectFile
			const index = projectFiles.findIndex(f => f.id === file.id)
			const files = replaceItemAtIndex(projectFiles, index, file)
			setSelectedFile(file)
			setProjectFiles(files)
		},
		[selectedFile, projectFiles, setSelectedFile, setProjectFiles],
	)
	return {
		showConfirm,
		errorMessage,
		selectedFile,
		projectFiles,
		originalTable,
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
	}
}

function useToggleLoadedCorrectly(
	selectedFile: Maybe<ProjectFile>,
	projectFiles: ProjectFile[],
	setProjectFiles: SetterOrUpdater<ProjectFile[]>,
	setSelectedFile: SetterOrUpdater<Maybe<ProjectFile>>,
) {
	return useCallback(() => {
		const stateNow = selectedFile?.loadedCorrectly || false
		const file = {
			...selectedFile,
			loadedCorrectly: !stateNow,
		} as ProjectFile
		const index = projectFiles.findIndex(f => f.id === file.id)
		const files = replaceItemAtIndex(projectFiles, index, file)
		setProjectFiles(files)
		setSelectedFile(file)
	}, [selectedFile, projectFiles, setProjectFiles, setSelectedFile])
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
	const addOriginalTable = useSetOrUpdateOriginalTable()
	return useCallback(
		(file: ProjectFile, table: ColumnTable) => {
			if (projectFiles.find(s => s.name === file.name)) {
				setErrorMessage('File already uploaded')
			} else {
				const fileId = uuidv4()
				file.id = fileId
				file.loadedCorrectly = true
				addFile(file)
				addOriginalTable({ tableId: fileId, table })
			}
		},
		[addFile, projectFiles, addOriginalTable, setErrorMessage],
	)
}
