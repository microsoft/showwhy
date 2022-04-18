/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DropFilesCount } from '@showwhy/components'
import type { ProjectFile } from '@showwhy/types'
import { type Dispatch, type SetStateAction, useCallback } from 'react'

export function useOnLoadCompleted(
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
