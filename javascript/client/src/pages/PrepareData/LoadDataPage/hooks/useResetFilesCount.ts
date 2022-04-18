/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DropFilesCount } from '@showwhy/components'
import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'

export function useResetFilesCount(
	setFilesCount: (count: DropFilesCount) => void,
): Handler {
	return useCallback(() => {
		setFilesCount({
			total: 0,
			completed: 0,
		})
	}, [setFilesCount])
}
