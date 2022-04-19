/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BaseFile,
	FileCollection,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import { FileType, isZipFile } from '@data-wrangling-components/utilities'
import type { DropFilesCount } from '@showwhy/components'
import type { Handler, Handler1, ProjectFile } from '@showwhy/types'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

import { useAddFilesToCollection } from './fileCollection'
import { useOnDropZipFilesAccepted } from './uploadZip'
import { useCreateColumnTable } from './useCreateColumnTable'

export function useDropzone(
	onError?: (msg: string) => void,
	onLoad?: (file: ProjectFile) => void,
): {
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
	fileCount: DropFilesCount
	loading: boolean
	progress?: number
} {
	const [loading, setLoading] = useState<boolean>(false)
	const [progress, setProgress] = useState<number | undefined>()
	const [fileCount, setFileCount] = useState<DropFilesCount>({
		total: 0,
		completed: 0,
	})
	const resetCount = useResetFilesCount(setFileCount)
	const onLoadStart = useOnLoadStart(setLoading, onError)
	const onFileLoadCompleted = useOnLoadCompleted(
		setFileCount,
		setLoading,
		onLoad,
	)
	const onDrop = useHandleOnDrop(onFileLoadCompleted, onLoadStart, setProgress)
	const onDropAccepted = useOnDropAccepted(onError, setFileCount)
	const onDropRejected = useOnDropRejected(onError, resetCount)

	return {
		onDrop,
		onDropAccepted,
		onDropRejected,
		fileCount,
		loading,
		progress,
	}
}

function useOnLoadStart(setLoading: any, onError: any): Handler {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [setLoading, onError])
}

function useOnLoadCompleted(
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

function useResetFilesCount(
	setFilesCount: (count: DropFilesCount) => void,
): Handler {
	return useCallback(() => {
		setFilesCount({
			total: 0,
			completed: 0,
		})
	}, [setFilesCount])
}

function useOnDropRejected(
	onError?: (text: string) => void,
	cb?: Handler,
): (message: string) => void {
	return useCallback(
		(message: string) => {
			onError && onError(message)
			cb && cb()
		},
		[onError, cb],
	)
}

function useOnDropAccepted(
	onError?: (msg: string) => void,
	setFileCount?: (fileCount: DropFilesCount) => void,
): (files: FileCollection) => void {
	const onDropZipFilesAccepted = useOnDropZipFilesAccepted(onError)
	const onDropDatasetFilesAccepted = useOnDropDatasetFilesAccepted(setFileCount)
	return useCallback(
		(fileCollection: FileCollection) => {
			const isZip = isZipFile(fileCollection.name)
			const hasJson = !!fileCollection.list(FileType.json).length
			if (isZip || hasJson) {
				onDropZipFilesAccepted(fileCollection)
			} else {
				onDropDatasetFilesAccepted(fileCollection.list(FileType.table))
			}
		},
		[onDropZipFilesAccepted, onDropDatasetFilesAccepted],
	)
}

function useHandleOnDrop(
	onFileLoadCompleted: (file: ProjectFile) => void,
	onLoadStart?: Handler,
	onProgress?: Handler1<number>,
): (files: FileCollection) => void {
	const onDrop = useCreateColumnTable(
		onFileLoadCompleted,
		onLoadStart,
		onProgress,
	)
	return useCallback(
		(fileCollection: FileCollection) => {
			if (!fileCollection.list().length) return
			const isZip = isZipFile(fileCollection.name)
			const hasJson = !!fileCollection.list(FileType.json).length
			if (!isZip && !hasJson) {
				onDrop(fileCollection.list(FileType.table))
			}
		},
		[onDrop],
	)
}

function useOnDropDatasetFilesAccepted(
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
