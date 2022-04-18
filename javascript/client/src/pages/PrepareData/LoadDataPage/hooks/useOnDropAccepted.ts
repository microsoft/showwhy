/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	type FileCollection,
	FileType,
	isZipFile,
} from '@data-wrangling-components/utilities'
import type { DropFilesCount } from '@showwhy/components'
import { useCallback } from 'react'

import { useOnDropZipFilesAccepted } from '~hooks'

import { useOnDropDatasetFilesAccepted } from './useOnDropDatasetFilesAccepted'

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
