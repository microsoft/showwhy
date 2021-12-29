/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import ColumnTable from 'arquero/dist/types/table/column-table'
import { useState, useCallback, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { useOnDropRejected } from './dropzone'
import { useSupportedFileTypes } from './supportedFileTypes'
import { DropFilesCount, ProjectFile } from '~interfaces'
import { GenericFn, GenericObject } from '~types'
import { createDefaultTable } from '~utils'

export function useDrop(
	onFileLoad: (file: ProjectFile, table: ColumnTable) => void,
	onLoadStart?: () => void,
): (files: File[], delimiter?: string) => void {
	return useCallback(
		(files: File[], delimiter?: string) => {
			onLoadStart && onLoadStart()
			files.forEach((file: File) => {
				const name = file.name
				const reader = new FileReader()
				reader.onabort = () => console.log('file reading was aborted')
				reader.onerror = () => console.log('file reading has failed')
				reader.onload = () => {
					const content = reader.result
						? reader.result.toString().replace(/ï»¿/g, '')
						: ''
					const table = createDefaultTable(
						content,
						delimiter || name.includes('.tsv') ? '\t' : ',',
					)
					onFileLoad(
						{
							content,
							name,
						},
						table,
					)
				}
				reader.readAsBinaryString(file)
			})
		},
		[onFileLoad, onLoadStart],
	)
}

export const useHandleDropzone = (
	onError?: (message: string | null) => void,
	onLoad?: (file: ProjectFile, table: ColumnTable) => void,
): GenericObject => {
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
	const handleDrop = useDrop(onFileLoadComplete, onLoadStart)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: files => handleDrop(files),
		onDropAccepted: onDropFilesAccepted,
		onDropRejected: onDropFilesRejected,
		accept: fileTypesAllowed.toString(),
	})

	return {
		loading,
		filesCount,
		getRootProps,
		getInputProps,
		isDragActive,
	}
}

export const useOnLoadStart = (setLoading: any, onError: any): (() => void) => {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [setLoading, onError])
}

export const useOnFileLoadCompleted = (setFilesCount, setLoading, onLoad) => {
	return useCallback(
		(file: ProjectFile, table: ColumnTable) => {
			setFilesCount(prev => {
				return {
					...prev,
					completed: prev.completed + 1,
				}
			})
			setLoading(false)
			onLoad && onLoad(file, table)
		},
		[setFilesCount, setLoading, onLoad],
	)
}

export const useOnDropDatasetFilesAccepted = (setFilesCount: GenericFn) => {
	return useCallback(
		(files: File[]) => {
			setFilesCount({
				total: files.length,
				completed: 0,
			})
		},
		[setFilesCount],
	)
}

export const useResetCount = (setFilesCount: GenericFn) => {
	return useCallback(() => {
		setFilesCount({
			total: 0,
			completed: 0,
		})
	}, [setFilesCount])
}
