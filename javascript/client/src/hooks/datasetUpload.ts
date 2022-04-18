/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	BaseFile,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import type { DropFilesCount } from '@showwhy/components'
import type { Handler } from '@showwhy/types'
import type { Dispatch, SetStateAction } from 'react'
import { useCallback } from 'react'

import type { ProjectFile } from '~types'

import { useAddFilesToCollection } from './fileCollection'

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
