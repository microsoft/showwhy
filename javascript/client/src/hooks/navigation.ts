/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { Handler } from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'

import { useSetDefinitionType } from '~state'

import { useHandleTabNavigation } from './tabsNavigation'

export function useGoToPage(
	url: string,
	state?: unknown,
	isPrev = false,
): Handler {
	const history = useHistory()
	const handleTabNavigation = useHandleTabNavigation()
	const setDefinitionType = useSetDefinitionType()
	return useCallback(() => {
		if (history.location.pathname === '/define/alternative' && !isPrev) {
			const tab = handleTabNavigation()
			if (tab !== 'END') {
				return
			} else {
				setDefinitionType(DefinitionType.Population)
			}
		}
		history.push(url)
		if (state) {
			history.location.state = state
		}
	}, [history, url, state, handleTabNavigation, setDefinitionType, isPrev])
}
