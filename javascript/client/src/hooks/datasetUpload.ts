/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDropzone } from '@data-wrangling-components/react'
import type {
	BaseFile,
	FileCollection,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { FileType } from '@data-wrangling-components/utilities'
import type { Handler, Handler1 } from '@showwhy/types'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useEffect, useState } from 'react'

import type { DropFilesCount, ProjectFile } from '~types'

import { useOnDropRejected } from './dropzone'
import { useAddFilesToCollection } from './fileCollection'
import { useSupportedFileTypes } from './supportedFileTypes'
import { useCreateColumnTable } from './useCreateColumnTable'

export function useHandleDropzone(
	onError?: Handler1<string | null>,
	onLoad?: Handler1<ProjectFile>,
): {
	loading: boolean
	filesCount: DropFilesCount
	isDragActive: boolean
	getRootProps: (props: any) => any
	getInputProps: (props: any) => any
} {
	const [loading, setLoading] = useState<boolean>(false)
	const fileTypesAllowed = useSupportedFileTypes()
	const [filesCount, setFilesCount] = useState<DropFilesCount>({
		total: 0,
		completed: 0,
	})

	const resetCount = useResetCount(setFilesCount)

	const onFileLoadComplete = useOnFileLoadCompleted(
		setFilesCount,
		setLoading,
		onLoad,
	)

	useEffect(() => {
		if (filesCount.total === filesCount.completed) {
			setLoading(false)
		}
	}, [setLoading, filesCount])

	const onLoadStart = useOnLoadStart(setLoading, onError)
	const onDropFilesAccepted = useOnDropDatasetFilesAccepted(setFilesCount)
	const onDropFilesRejected = useOnDropRejected(onError, resetCount)
	const handleDrop = useCreateColumnTable(onFileLoadComplete, onLoadStart)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (fileCollection: FileCollection) =>
			handleDrop(fileCollection.list(FileType.table)),
		onDropAccepted: (fileCollection: FileCollection) =>
			onDropFilesAccepted(fileCollection.list(FileType.table)),
		onDropRejected: onDropFilesRejected,
		acceptedFileTypes: fileTypesAllowed,
	})

	return {
		loading,
		filesCount,
		getRootProps,
		getInputProps,
		isDragActive,
	}
}

export function useOnLoadStart(setLoading: any, onError: any): Handler {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [setLoading, onError])
}

export function useOnFileLoadCompleted(
	setFilesCount: (dispatch: (prev: DropFilesCount) => DropFilesCount) => void,
	setLoading: Dispatch<SetStateAction<boolean>>,
	onLoad?: (file: ProjectFile) => void,
): (file: ProjectFile) => void {
	return useCallback(
		(file: ProjectFile) => {
			setFilesCount((prev: DropFilesCount) => {
				return {
					...prev,
					completed: prev.completed + 1,
				} as DropFilesCount
			})
			setLoading(false)
			onLoad && onLoad(file)
		},
		[setFilesCount, setLoading, onLoad],
	)
}

export function useOnDropDatasetFilesAccepted(
	setFilesCount?: (count: DropFilesCount) => void,
): (files: BaseFile[]) => void {
	const addFilesToCollection = useAddFilesToCollection()
	return useCallback(
		async (files: BaseFile[]) => {
			await addFilesToCollection(files as FileWithPath[])
			setFilesCount &&
				setFilesCount({
					total: files.length,
					completed: 0,
				})
		},
		[setFilesCount, addFilesToCollection],
	)
}

export function useResetCount(
	setFilesCount: (count: DropFilesCount) => void,
): Handler {
	return useCallback(() => {
		setFilesCount({
			total: 0,
			completed: 0,
		})
	}, [setFilesCount])
}
