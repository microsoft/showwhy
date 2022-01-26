/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useLoadProject, useResetProject } from '~hooks'
import { FileDefinition } from '~types'

export function useOnClickProject(): (example: FileDefinition) => void {
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
