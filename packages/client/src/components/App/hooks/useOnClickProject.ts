/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useLoadProject, useResetProject } from '~hooks'
import type { FileDefinition, Handler1 } from '~types'

type OnClickHandler = Handler1<FileDefinition>

export function useOnClickProject(): OnClickHandler {
	const loadExample = useLoadProject()
	const resetProject = useResetProject()

	return useCallback(
		(example: FileDefinition) => {
			resetProject()
			loadExample(example)
		},
		[loadExample, resetProject],
	)
}
