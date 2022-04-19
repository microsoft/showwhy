/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { FileWithPath } from '@data-wrangling-components/utilities'
import { useCallback, useMemo } from 'react'
import { useFileCollection, useSetFileCollection } from '~state'

export const useIsCollectionEmpty = (): boolean => {
	const fileCollection = useFileCollection().copy()
	return useMemo(() => {
		return !fileCollection.list().length
	}, [fileCollection])
}

export function useAddFilesToCollection(): (
	files: FileWithPath[],
	name?: string,
) => Promise<void> {
	const setFileCollection = useSetFileCollection()
	const fileCollection = useFileCollection().copy()
	return useCallback(
		async (files: FileWithPath[], name?: string) => {
			await fileCollection.add(files)
			fileCollection.name = name || fileCollection.name || 'File Collection'
			setFileCollection(fileCollection)
		},
		[fileCollection, setFileCollection],
	)
}
