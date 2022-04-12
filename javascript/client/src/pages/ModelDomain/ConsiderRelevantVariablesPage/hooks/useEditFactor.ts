/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor } from '@showwhy/types'
import { useCallback } from 'react'

export function useEditFactor(
	setFactor: (factor: CausalFactor) => void,
	setIsEditing: (isEditing: boolean) => void,
): (factor: CausalFactor) => void {
	return useCallback(
		factorToEdit => {
			setFactor(factorToEdit)
			setIsEditing(true)
		},
		[setFactor, setIsEditing],
	)
}
