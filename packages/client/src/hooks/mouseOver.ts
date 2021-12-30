/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { DecisionFeature, Specification } from '~interfaces'
import { useSetHoverState } from '~state'

export const useOnMouseOver = (): ((
	item: Specification | DecisionFeature | undefined,
) => void) => {
	const setHovered = useSetHoverState()
	return useCallback(
		(item: Specification | DecisionFeature | undefined) => {
			setHovered(item?.id)
		},
		[setHovered],
	)
}
