/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	FileType,
	BaseFile,
} from '@data-wrangling-components/utilities'
import { useMemo, useCallback } from 'react'
import { useLoadProject } from './loadProject'
import { ProjectSource } from '~enums'
import { GenericFn } from '~types'
import { groupFilesByType, isZipUrl } from '~utils'

const uploadZipButtonId = 'uploadZip'
const acceptedFileTypes = [`.${FileType.zip}`]

export const useAcceptedFileTypes = (): string[] => {
	return acceptedFileTypes
}

export const useUploadZipButtonId = (): string => {
	return uploadZipButtonId
}

const validateProjectFiles = async (fileCollection: FileCollection) => {
	if (!fileCollection) {
		throw new Error('No file collection provided')
	}
	const [jsonFile]: BaseFile[] = fileCollection.list(FileType.json)
	if (!jsonFile) {
		throw new Error('No JSON file found in zip')
	}
	const jsonTables = (await jsonFile.getJson()).tables
	const tableEntries = fileCollection.list(FileType.table).map(e => e.name)

	const requiredTables = jsonTables
		.filter(t => isZipUrl(t.url))
		.map(t => t.name)

	const hasRequiredTables = requiredTables.every(table =>
		tableEntries.includes(table),
	)
	if (!hasRequiredTables) {
		throw new Error('Required table from .json file not found in zip')
	}
	return true
}

export const useHandleFiles = () => {
	const loadProject = useLoadProject(ProjectSource.zip)
	return async function handleFiles(fileCollection: FileCollection) {
		if (!fileCollection) return
		try {
			/* eslint-disable @essex/adjacent-await */
			await validateProjectFiles(fileCollection)
			const files = await groupFilesByType(fileCollection)
			loadProject(undefined, files)
		} catch (e) {
			throw e
		}
	}
}

export const useOnDropZipFilesAccepted = (onError?: GenericFn) => {
	const handleDrop = useHandleFiles()
	return useCallback(
		async (fileCollection: FileCollection) => {
			try {
				await handleDrop(fileCollection)
			} catch (e) {
				onError && onError((e as Error).message)
			}
		},
		[handleDrop, onError],
	)
}

export const useHandleUploadZip = () => {
	const handleFiles = useHandleFiles()
	return useCallback(() => {
		let input: HTMLInputElement | null = document.createElement('input')
		input.type = 'file'
		input.multiple = true
		input.accept = acceptedFileTypes.toString()
		input.onchange = async (e: any) => {
			if (e?.target?.files?.length) {
				const { files } = e.target
				const fileCollection = new FileCollection()
				try {
					await fileCollection.init([files[0]])
					handleFiles && handleFiles(fileCollection)
				} catch (e) {
					console.error(e)
				}
			}
		}
		input.click()
		input = null
	}, [handleFiles])
}

export const useUploadZipMenuOption = () => {
	const id = useUploadZipButtonId()
	const handleClick = useHandleUploadZip()
	return useMemo(() => {
		return {
			key: id,
			text: 'Open project',
			iconProps: { iconName: 'Upload' },
			onClick: handleClick,
		}
	}, [id, handleClick])
}
