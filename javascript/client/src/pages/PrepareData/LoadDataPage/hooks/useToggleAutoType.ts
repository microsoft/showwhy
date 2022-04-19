/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { AsyncHandler1, Handler1, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

import type { ProjectFile } from '~types'
import { createDefaultTable } from '~utils'

export function useToggleAutoType(
	doUpdateFiles: Handler1<ProjectFile>,
	selectedFile: Maybe<ProjectFile>,
): AsyncHandler1<boolean> {
	return useCallback(
		async (autoType: boolean) => {
			const table = createDefaultTable(
				selectedFile?.table?.toCSV() || '',
				selectedFile?.delimiter,
				undefined,
				autoType,
			)
			const file = {
				...selectedFile,
				table,
				autoType,
			} as ProjectFile
			doUpdateFiles(file)
		},
		[selectedFile, doUpdateFiles],
	)
}
