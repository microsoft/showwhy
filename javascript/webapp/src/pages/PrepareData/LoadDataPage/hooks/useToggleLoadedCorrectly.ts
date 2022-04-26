/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler1, Maybe, ProjectFile } from '@showwhy/types'
import { useCallback } from 'react'

export function useToggleLoadedCorrectly(
	doUpdateFiles: Handler1<ProjectFile>,
	selectedFile: Maybe<ProjectFile>,
): (delimiter?: string) => void {
	return useCallback(
		(delimiter?: string) => {
			const stateNow = selectedFile?.loadedCorrectly || false
			const file = {
				...selectedFile,
				loadedCorrectly: !stateNow,
				delimiter,
			} as ProjectFile
			doUpdateFiles(file)
		},
		[selectedFile, doUpdateFiles],
	)
}
