/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileCollection } from '@data-wrangling-components/utilities'
import { FileType, isZipFile } from '@data-wrangling-components/utilities'
import type { Handler, Handler1 } from '@showwhy/types'
import { useCallback, useMemo, useState } from 'react'

import {
	useAcceptedFileTypes,
	useCreateColumnTable,
	useOnDropDatasetFilesAccepted,
	useOnDropRejected,
	useOnDropZipFilesAccepted,
	useOnFileLoadCompleted,
	useOnLoadStart,
	useResetCount,
	useSupportedFileTypes,
} from '~hooks'
import type { DropFilesCount, ProjectFile } from '~types'

export function useHandleOnDrop(
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

export function useOnDropAccepted(
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

function useAccepted(): string[] {
	const acceptedZip = useAcceptedFileTypes()
	const acceptedFiles = useSupportedFileTypes()
	return useMemo(
		() => [...acceptedFiles, ...acceptedZip],
		[acceptedFiles, acceptedZip],
	)
}

export function useGlobalDropzone(
	onError?: (msg: string) => void,
	onLoad?: (file: ProjectFile) => void,
): {
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
	fileCount: DropFilesCount
	loading: boolean
	acceptedFileTypes: string[]
	progress?: number
} {
	const [loading, setLoading] = useState<boolean>(false)
	const [progress, setProgress] = useState<number | undefined>()
	const [fileCount, setFileCount] = useState<DropFilesCount>({
		total: 0,
		completed: 0,
	})
	const resetCount = useResetCount(setFileCount)
	const onLoadStart = useOnLoadStart(setLoading, onError)
	const onFileLoadCompleted = useOnFileLoadCompleted(
		setFileCount,
		setLoading,
		onLoad,
	)
	const acceptedFileTypes = useAccepted()
	const onDrop = useHandleOnDrop(onFileLoadCompleted, onLoadStart, setProgress)
	const onDropAccepted = useOnDropAccepted(onError, setFileCount)
	const onDropRejected = useOnDropRejected(onError, resetCount)

	return {
		onDrop,
		onDropAccepted,
		onDropRejected,
		fileCount,
		loading,
		acceptedFileTypes,
		progress,
	}
}
