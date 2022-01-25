/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { useSetHoverState } from '~state'
import { DecisionFeature, Specification } from '~types'

export function useOnMouseOver(): (
	item: Specification | DecisionFeature | undefined,
) => void {
	const setHovered = useSetHoverState()
	return useCallback(
		(item: Specification | DecisionFeature | undefined) => {
			setHovered(item?.id)
		},
		[setHovered],
	)
}
