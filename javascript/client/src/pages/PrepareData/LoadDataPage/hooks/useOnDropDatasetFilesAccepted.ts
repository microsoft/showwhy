/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	BaseFile,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import type { DropFilesCount } from '@showwhy/components'
import { useCallback } from 'react'
import { useAddFilesToCollection } from '~hooks'

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
