/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useDropzone } from '@data-wrangling-components/react'
import {
	BaseFile,
	FileCollection,
	FileType,
} from '@data-wrangling-components/utilities'
import ColumnTable from 'arquero/dist/types/table/column-table'
import {
	useState,
	useCallback,
	useEffect,
	SetStateAction,
	Dispatch,
} from 'react'
import { useOnDropRejected } from './dropzone'
import { useSupportedFileTypes } from './supportedFileTypes'
import { DropFilesCount, ProjectFile } from '~interfaces'
import { GenericFn, GenericObject } from '~types'
import { createDefaultTable } from '~utils'

export function useDrop(
	onFileLoad: (file: ProjectFile, table: ColumnTable) => void,
	onLoadStart?: () => void,
): (files: BaseFile[], delimiter?: string) => void {
	return useCallback(
		(files: BaseFile[], delimiter?: string) => {
			console.log('useDrop', files, delimiter)
			onLoadStart && onLoadStart()
			files.forEach((file: BaseFile) => {
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

export function useHandleDropzone(
	onError?: (message: string | null) => void,
	onLoad?: (file: ProjectFile, table: ColumnTable) => void,
): GenericObject {
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

export function useOnLoadStart(setLoading: any, onError: any): () => void {
	return useCallback(() => {
		setLoading(true)
		onError && onError(null)
	}, [setLoading, onError])
}

export function useOnFileLoadCompleted(
	setFilesCount: (prev: any) => any,
	setLoading: Dispatch<SetStateAction<boolean>>,
	onLoad?: (file: ProjectFile, table: ColumnTable) => void,
): (file: ProjectFile, table: ColumnTable) => void {
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

export function useOnDropDatasetFilesAccepted(
	setFilesCount?: GenericFn,
): (files: BaseFile[]) => void {
	return useCallback(
		(files: BaseFile[]) => {
			console.log('useOnDropDatasetFilesAccepted', files)
			setFilesCount &&
				setFilesCount({
					total: files.length,
					completed: 0,
				})
		},
		[setFilesCount],
	)
}

export function useResetCount(setFilesCount: GenericFn): () => void {
	return useCallback(() => {
		setFilesCount({
			total: 0,
			completed: 0,
		})
	}, [setFilesCount])
}
