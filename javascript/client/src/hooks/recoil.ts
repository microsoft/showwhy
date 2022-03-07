/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback } from 'react'
import type { RecoilState } from 'recoil'
import { useRecoilState } from 'recoil'

export type ToggleCallback = () => void

export function useRecoilBasedToggle(
	state: RecoilState<boolean>,
): [boolean, ToggleCallback] {
	const [value, setValue] = useRecoilState(state)
	const toggle = useCallback(
		() => setValue((current: boolean) => !current),
		[setValue],
	)

	return [value, toggle]
}
