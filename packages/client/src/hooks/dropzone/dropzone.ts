/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileCollection,
	FileType,
	isZipFile,
} from '@data-wrangling-components/utilities'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useMemo, useCallback, useState } from 'react'
import {
	useAcceptedFileTypes,
	useDrop,
	useOnDropDatasetFilesAccepted,
	useOnDropRejected,
	useOnDropZipFilesAccepted,
	useOnFileLoadCompleted,
	useOnLoadStart,
	useResetCount,
	useSupportedFileTypes,
} from '~hooks'
import { DropFilesCount, ProjectFile } from '~interfaces'

export function useHandleOnDrop(
	onFileLoadCompleted: (file: ProjectFile, table: ColumnTable) => void,
	onLoadStart?: () => void,
): (files: FileCollection) => void {
	const onDrop = useDrop(onFileLoadCompleted, onLoadStart)
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
			if (isZipFile(fileCollection.name)) {
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
	onLoad?: (file: ProjectFile, table: ColumnTable) => void,
): {
	onDrop: (f: FileCollection) => void
	onDropAccepted: (f: FileCollection) => void
	onDropRejected: (msg: string) => void
	fileCount: DropFilesCount
	loading: boolean
	acceptedFileTypes: string[]
} {
	const [loading, setLoading] = useState<boolean>(false)
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
	const onDrop = useHandleOnDrop(onFileLoadCompleted, onLoadStart)
	const onDropAccepted = useOnDropAccepted(onError, setFileCount)
	const onDropRejected = useOnDropRejected(onError, resetCount)

	return {
		onDrop,
		onDropAccepted,
		onDropRejected,
		fileCount,
		loading,
		acceptedFileTypes,
	}
}
