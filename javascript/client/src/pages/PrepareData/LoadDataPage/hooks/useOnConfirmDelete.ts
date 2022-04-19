/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnConfirmDelete(
	doRemoveFile: Handler,
	toggleShowConfirm: (value?: boolean) => void,
): Handler {
	return useCallback(() => {
		doRemoveFile()
		toggleShowConfirm()
	}, [toggleShowConfirm, doRemoveFile])
}
