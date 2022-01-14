/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileWithPath,
	FileCollection,
} from '@data-wrangling-components/utilities'
import { useCallback, useMemo } from 'react'
import { useFileCollection, useSetFileCollection } from '~state'

export const useIsCollectionEmpty = () => {
	const fileCollection = useFileCollection().copy()
	return useMemo(() => {
		return !fileCollection.list().length
	}, [fileCollection])
}

export const useAddFilesToCollection = () => {
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

export const useUpdateFileCollection = () => {
	const setFileCollection = useSetFileCollection()
	const fc = useFileCollection().copy()
	return useCallback(
		async (fileCollection: FileCollection) => {
			const files = [...(fileCollection.list() as FileWithPath[])]
			if (!fc.name) {
				fc.name = fileCollection.name
			}
			await fc.add(files)
			setFileCollection(fc)
		},
		[fc, setFileCollection],
	)
}
