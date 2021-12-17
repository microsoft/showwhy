/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import * as zip from '@zip.js/zip.js'
import { useMemo, useCallback } from 'react'
import { useDropzone, FileRejection } from 'react-dropzone'
import { useOnDropRejected } from './dropzone'
import { useLoadProject } from './loadProject'
import { FileType, ProjectSource } from '~enums'
import { getJsonFileContent, groupFilesByType } from '~utils'

const uploadZipButtonId = 'uploadZip'
const acceptedFileTypes = [`.${FileType.zip}`]

export const useAcceptedFileTypes = (): string[] => {
	return acceptedFileTypes
}

export const useUploadZipButtonId = (): string => {
	return uploadZipButtonId
}

export const useUploadZipMenuOption = () => {
	const id = useUploadZipButtonId()
	return useMemo(() => {
		return {
			key: id,
			text: 'Open project',
			iconProps: { iconName: 'Upload' },
			onClick: () => {
				document.getElementById(id)?.click()
			},
		}
	}, [useUploadZipButtonId])
}

const getJsonTables = async jsonFile => {
	const json = await getJsonFileContent(jsonFile)
	return json.tables.map(t => t.name)
}

const validateProjectFiles = async entries => {
	const jsonFile = entries.find(entry => entry.filename.includes(FileType.json))
	if (!jsonFile) {
		throw new Error('No JSON file found in zip')
	}
	const jsonTables = await getJsonTables(jsonFile)
	const entryNames = entries.map(e => e.filename.split('/').pop())
	const tableEntries = entryNames.filter(
		e => e.includes(FileType.csv) || e.includes(FileType.tsv),
	)
	const requiredTables = jsonTables.every(table => tableEntries.includes(table))
	if (!requiredTables) {
		throw new Error('Required table from .json file not found in zip')
	}
	return true
}

export const useHandleFiles = () => {
	const loadProject = useLoadProject(ProjectSource.zip)
	return async function handleFiles(files: File[] = []) {
		const [file] = files
		const reader = new zip.BlobReader(file)
		const zipReader = new zip.ZipReader(reader)
		const entries = await zipReader.getEntries()
		await zipReader.close()
		try {
			await validateProjectFiles(entries)
			loadProject(undefined, groupFilesByType(entries, file.name))
		} catch (e) {
			throw e
		}
	}
}

export const useOnDropZipFilesAccepted = onError => {
	const handleDrop = useHandleFiles()
	return useCallback(
		async (files: File[]) => {
			try {
				await handleDrop(files)
			} catch (e) {
				onError && onError((e as Error).message)
			}
		},
		[handleDrop, onError],
	)
}

export const useHandleDropzoneForZip = (onError?, dropzoneProps = {}) => {
	const onDropFilesAccepted = useOnDropZipFilesAccepted(onError)
	const onDropFilesRejected = useOnDropRejected(onError)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDropAccepted: onDropFilesAccepted,
		onDropRejected: onDropFilesRejected,
		accept: acceptedFileTypes.toString(),
		...dropzoneProps,
	})

	return { getRootProps, getInputProps, isDragActive, acceptedFileTypes }
}
