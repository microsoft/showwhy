/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Handler1, Maybe } from '@showwhy/types'
import { useCallback } from 'react'

export function useOnSetSubjectIdentifier(
	subjectIdentifier: Maybe<string>,
	setSubjectIdentifier: Handler1<Maybe<string>>,
	onSelect: Handler1<boolean>,
): Handler1<Maybe<string>> {
	return useCallback(
		(columnName: string | undefined) => {
			if (subjectIdentifier === columnName) {
				setSubjectIdentifier(undefined)
				onSelect(false)
			} else {
				setSubjectIdentifier(columnName)
				onSelect(true)
			}
		},
		[subjectIdentifier, setSubjectIdentifier, onSelect],
	)
}
