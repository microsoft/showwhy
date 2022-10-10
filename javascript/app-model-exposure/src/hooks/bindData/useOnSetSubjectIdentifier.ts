/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'

import type { Handler1, Maybe } from '../../types/primitives.js'

export function useOnSetSubjectIdentifier(
	subjectIdentifier: Maybe<string>,
	setSubjectIdentifier: Handler1<Maybe<string>>,
): Handler1<Maybe<string>> {
	return useCallback(
		(columnName: string | undefined) => {
			if (subjectIdentifier === columnName) {
				setSubjectIdentifier(undefined)
			} else {
				setSubjectIdentifier(columnName)
			}
		},
		[subjectIdentifier, setSubjectIdentifier],
	)
}
