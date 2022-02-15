/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import { useGuidanceState } from '~state'
import { Handler } from '~types'

export function useGuidance(): [boolean, Handler] {
	const [isGuidanceVisible, setGuidanceVisible] = useGuidanceState()
	const toggleGuidance = useCallback(
		() => setGuidanceVisible((cur: boolean) => !cur),
		[setGuidanceVisible],
	)
	return [isGuidanceVisible, toggleGuidance]
}
