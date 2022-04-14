/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DecisionFeature, Maybe, Specification } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetHoverState } from '~state'

export function useOnMouseOver(): (
	item: Maybe<Specification | DecisionFeature>,
) => void {
	const setHovered = useSetHoverState()
	return useCallback(
		(item: Maybe<Specification | DecisionFeature>) => {
			setHovered(item?.id)
		},
		[setHovered],
	)
}
