/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { DefinitionType } from '@showwhy/types'
import { capitalize } from 'lodash'
import { useCallback } from 'react'

import { useDefinitionType, useSetDefinitionType } from '~state'

export function useHandleOnLinkClick(): (item: any) => void {
	const setDefinitionType = useSetDefinitionType()
	return useCallback(
		(item: any) => {
			const regex = /[^a-zA-Z]/g
			const type = item.key?.replace(regex, '')
			if (type) {
				setDefinitionType(type)
			}
		},
		[setDefinitionType],
	)
}

function goToNextTab(currentTab: string): string {
	const tabs: string[] = Object.keys(DefinitionType).filter(
		k => !k.includes('Cause') && !k.includes('Confounders'),
	)
	const nextIndex = tabs.indexOf(currentTab) + 1
	let nextTab = currentTab
	if (nextIndex >= 0 && nextIndex < tabs.length) {
		nextTab = tabs[nextIndex] as string
	} else if (nextIndex >= tabs.length) {
		nextTab = 'END'
	}
	return nextTab
}

export function useHandleTabNavigation(): () => string {
	const handleOnLinkClick = useHandleOnLinkClick()
	const currentTab = capitalize(useDefinitionType())
	return useCallback(() => {
		const nextTab = goToNextTab(currentTab)
		if (nextTab !== 'END') {
			const tab: HTMLButtonElement | null = document.querySelector(
				`button[role="tab"][name="${nextTab}"]`,
			)
			tab?.click()
			handleOnLinkClick({ key: nextTab.toLowerCase() })
		}
		return nextTab
	}, [handleOnLinkClick, currentTab])
}
