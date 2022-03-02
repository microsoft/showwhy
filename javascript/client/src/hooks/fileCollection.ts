/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	FileWithPath,
	FileCollection,
} from '@data-wrangling-components/utilities'
import type { AsyncHandler1 } from '@showwhy/types'
import { useCallback, useMemo } from 'react'
import { useFileCollection, useSetFileCollection } from '~state'

export const useIsCollectionEmpty = (): boolean => {
	const fileCollection = useFileCollection().copy()
	return useMemo(() => {
		return !fileCollection.list().length
	}, [fileCollection])
}

export function useAddFilesToCollection(): AsyncHandler1<FileWithPath[]> {
	const setFileCollection = useSetFileCollection()
	const fileCollection = useFileCollection().copy()
	return useCallback(
		async (files: FileWithPath[]) => {
			await fileCollection.add(files)
			setFileCollection(fileCollection)
		},
		[fileCollection, setFileCollection],
	)
}

export function useUpdateFileCollection(): AsyncHandler1<FileCollection> {
	const setFileCollection = useSetFileCollection()
	const fc = useFileCollection().copy()
	return useCallback(
		async (fileCollection: FileCollection) => {
			if (!fc.name) {
				fc.name = fileCollection.name
			}
			await fc.add([...(fileCollection.list() as FileWithPath[])])
			setFileCollection(fc)
		},
		[fc, setFileCollection],
	)
}
