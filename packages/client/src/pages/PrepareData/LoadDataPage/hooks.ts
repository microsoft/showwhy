/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { IDropdownOption } from '@fluentui/react'
import { useBoolean } from 'ahooks'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useGlobalDropzone } from '~hooks'
import { ProjectFile } from '~interfaces'
import {
	useAddProjectFile,
	useProjectFiles,
	useSelectedFile,
	useSelectOriginalTable,
	useSetOrUpdateOriginalTable,
	useSetProjectFiles,
	useSetSelectedFile,
} from '~state'
import { GenericObject } from '~types'
import { createDefaultTable, guessDelimiter, replaceItemAtIndex } from '~utils'

export const useBusinessLogic = (): GenericObject => {
	const setSelectedFile = useSetSelectedFile()
	const selectedFile = useSelectedFile()
	const projectFiles = useProjectFiles()
	const setProjectFiles = useSetProjectFiles()
	const [errorMessage, setErrorMessage] = useState<string | null>()
	const [selectedDelimiter, setSelectedDelimiter] = useState<
		string | undefined
	>()
	const [showConfirm, { toggle: toggleShowConfirm }] = useBoolean(false)
	const originalTableState = useSelectOriginalTable(selectedFile?.id as string)
	const originalTable = originalTableState()?.columns

	const handleDismissError = useCallback(() => {
		setErrorMessage('')
	}, [setErrorMessage])

	const addOriginalTable = useSetOrUpdateOriginalTable()

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
				addOriginalTable({ tableId: selectedFile.id, columns: table })
			}
			setSelectedDelimiter(delimiter)
		},
		[setSelectedDelimiter, selectedFile, addOriginalTable],
	)

	const handleLoadFile = useHandleLoadFile(setErrorMessage)

	const {
		loading,
		fileCount,
		getRootProps,
		getInputProps,
		isDragActive,
		acceptedFileTypes,
	} = useGlobalDropzone(setErrorMessage, handleLoadFile)

	return {
		showConfirm,
		errorMessage,
		selectedFile,
		projectFiles,
		originalTable,
		selectedDelimiter,
		setProjectFiles,
		onConfirmDelete,
		setSelectedFile,
		toggleShowConfirm,
		toggleLoadedCorrectly,
		handleDelimiterChange,
		loading,
		fileCount,
		getRootProps,
		getInputProps,
		isDragActive,
		handleDismissError,
		acceptedFileTypes,
	}
}

const useToggleLoadedCorrectly = (
	selectedFile,
	projectFiles,
	setProjectFiles,
	setSelectedFile,
) => {
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

const useDefaultSelectedFile = (current, files, setSelectedFile) => {
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

const useOnConfirmDelete = (
	projectFiles,
	selectedFile,
	setProjectFiles,
	toggleShowConfirm,
	setSelectedFile,
) => {
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

const useHandleLoadFile = setErrorMessage => {
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
				addOriginalTable({ tableId: fileId, columns: table })
			}
		},
		[addFile, projectFiles, addOriginalTable, setErrorMessage],
	)
}
