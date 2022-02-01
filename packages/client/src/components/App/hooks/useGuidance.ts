/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useBoolean } from '@fluentui/react-hooks'
import { useEffect } from 'react'
import { useSetGuidance } from '~state'
import { Handler0 } from '~types'

export function useGuidance(): [boolean, Handler0] {
	/* TODO: this is synchronizing state between an in-memory hook and recoil. This should just use recoil*/
	const [isGuidanceVisible, { toggle: toggleGuidance }] = useBoolean(true)
	const setGuidance = useSetGuidance()
	useEffect(() => {
		setGuidance(isGuidanceVisible)
	}, [isGuidanceVisible, setGuidance])
	return [isGuidanceVisible, toggleGuidance]
}
