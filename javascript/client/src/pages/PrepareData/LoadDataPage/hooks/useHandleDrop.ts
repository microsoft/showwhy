/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	type FileCollection,
	isZipFile,
	FileType,
} from '@data-wrangling-components/utilities'
import type { ProjectFile, Handler1, Handler } from '@showwhy/types'
import { useCallback } from 'react'
import { useCreateColumnTable } from '~hooks'

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
