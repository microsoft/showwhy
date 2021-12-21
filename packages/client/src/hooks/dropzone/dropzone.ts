/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo, useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
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
import { DropFilesCount } from '~interfaces'
import { isZipFile } from '~utils'

const useOnDrop = (onFileLoadCompleted, onLoadStart?) => {
	const onDrop = useDrop(onFileLoadCompleted, onLoadStart)
	return useCallback(
		(files: File[]) => {
			if (!files.length) return
			if (!isZipFile(files[0].name)) {
				onDrop(files)
			}
		},
		[onDrop, onLoadStart, onFileLoadCompleted],
	)
}

const useOnDropAccepted = (setFileCount, onError?) => {
	const onDropZipFilesAccepted = useOnDropZipFilesAccepted(onError)
	const onDropDatasetFilesAccepted = useOnDropDatasetFilesAccepted(setFileCount)
	return useCallback(
		(files: File[]) => {
			if (files.length === 1 && isZipFile(files[0].name)) {
				onDropZipFilesAccepted(files)
			} else {
				onDropDatasetFilesAccepted(files)
			}
		},
		[onDropZipFilesAccepted, onDropDatasetFilesAccepted, setFileCount, onError],
	)
}

const useAccepted = (): string[] => {
	const acceptedZip = useAcceptedFileTypes()
	const acceptedFiles = useSupportedFileTypes()
	return useMemo(
		() => [...acceptedFiles, ...acceptedZip],
		[acceptedFiles, acceptedZip],
	)
}

export const useGlobalDropzone = (onError?, onLoad?, dropzoneProps = {}) => {
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
	const accepted = useAccepted()
	const onDrop = useOnDrop(onFileLoadCompleted, onLoadStart)
	const onDropAccepted = useOnDropAccepted(setFileCount, onError)
	const onDropRejected = useOnDropRejected(onError, resetCount)
	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		onDropAccepted,
		onDropRejected,
		accept: accepted.toString(),
		...dropzoneProps,
	})

	return {
		getRootProps,
		getInputProps,
		isDragActive,
		fileCount,
		loading,
		acceptedFileTypes: accepted,
	}
}
