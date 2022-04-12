/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Maybe, OptionalId } from '@showwhy/types'
import { useCallback } from 'react'

import { useAddOrEditFactor } from '~hooks'

export function useAddFactor(
	isEditing: boolean,
	setIsEditing: (value: boolean) => void,
	setFactor: (factor: Maybe<CausalFactor>) => void,
): (factor: OptionalId<CausalFactor>) => void {
	const addOrEditFactor = useAddOrEditFactor()
	return useCallback(
		(newFactor: OptionalId<CausalFactor>) => {
			addOrEditFactor(newFactor)
			isEditing && setIsEditing(false)
			setFactor(undefined)
		},
		[addOrEditFactor, setIsEditing, isEditing, setFactor],
	)
}
