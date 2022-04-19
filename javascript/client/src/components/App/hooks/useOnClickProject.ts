/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler1 } from '@showwhy/types'
import { useCallback } from 'react'
import { useLoadProject } from '~hooks'
import type { FileDefinition } from '~types'
import { useResetProject } from './useResetProject'

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
