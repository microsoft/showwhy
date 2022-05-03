/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileType, isZipFile } from '@data-wrangling-components/utilities'
import type {
	Handler,
	Handler1,
	ProjectFile,
	DropFilesCount,
} from '@showwhy/types'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback, useState } from 'react'

import { useAddFilesToCollection } from '~hooks'

import { useCreateColumnTable } from './useCreateColumnTable'

export function useDropzone(
	onError: (msg: string) => void,
	onLoad: (file: ProjectFile) => void,
	onZipFileLoad: (files: FileCollection) => void,
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
	const onLoadStart = useLoadStart(setLoading, onError)
	const onFileLoadCompleted = useOnLoadCompleted(
		setFileCount,
		setLoading,
		onLoad,
	)
	const onDrop = useHandleOnDrop(onFileLoadCompleted, onLoadStart, setProgress)
	const onDropAccepted = useOnDropAccepted(onZipFileLoad, onError, setFileCount)
	const onDropRejected = useOnDropRejected(onError, setFileCount)

	return {
		onDrop,
		onDropAccepted,
		onDropRejected,
		fileCount,
		loading,
		progress,
	}
}

function useLoadStart(setLoading: any, onError: any): () => void {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [onError, setLoading])
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

function useOnDropRejected(
	onError: (text: string) => void,
	setFilesCount: (count: DropFilesCount) => void,
): (message: string) => void {
	return useCallback(
		(message: string) => {
			onError(message)
			setFilesCount({
				total: 0,
				completed: 0,
			})
		},
		[onError, setFilesCount],
	)
}

function useOnDropAccepted(
	onDrop: (files: FileCollection) => void,
	onError: (msg: string) => void,
	setFileCount: (fileCount: DropFilesCount) => void,
): (files: FileCollection) => void {
	const addFilesToCollection = useAddFilesToCollection()
	return useCallback(
		async (fileCollection: FileCollection) => {
			const isZip = isZipFile(fileCollection.name)
			const hasJson = !!fileCollection.list(FileType.json).length
			if (isZip || hasJson) {
				try {
					await onDrop(fileCollection)
				} catch (e) {
					onError((e as Error).message)
				}
			} else {
				const files = fileCollection.list(FileType.table)
				await addFilesToCollection(files)
				setFileCount({
					total: files.length,
					completed: 0,
				})
			}
		},
		[onDrop, onError, setFileCount, addFilesToCollection],
	)
}

function useHandleOnDrop(
	onFileLoadCompleted: (file: ProjectFile) => void,
	onLoadStart: Handler,
	onProgress: Handler1<number>,
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
