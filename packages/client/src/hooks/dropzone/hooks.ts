/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { FileRejection } from 'react-dropzone'
import { GenericFn } from '~types'

export const useOnDropRejected = (onError?, cb?: GenericFn) => {
	return useCallback(
		(files: FileRejection[]) => {
			const errors = files.flatMap(x => x.errors)
			const messages = [...new Set(errors.flatMap(x => x.message))]
			onError && onError(messages.join(' / '))
			cb && cb()
		},
		[onError, cb],
	)
}
