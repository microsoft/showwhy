/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Definition } from '@showwhy/types'
import { useCallback } from 'react'

import { replaceItemAtIndex } from '~utils/arrays'

import { useSetDefinitions } from '../state'

export function useSaveDefinition(): (
	newDefinition: CausalFactor | Definition,
) => void {
	const setDefinitions = useSetDefinitions()

	return useCallback(
		(newDefinition: CausalFactor | Definition) => {
			setDefinitions(definitions => {
				let newDefinitionList = [...definitions]

				const index = definitions?.findIndex(
					(x: Definition) => x.id === newDefinition?.id,
				)
				if (index > -1) {
					newDefinitionList = replaceItemAtIndex(
						newDefinitionList,
						index,
						newDefinition,
					)
				} else {
					newDefinitionList.push(newDefinition)
				}
				return newDefinitionList
			})
		},
		[setDefinitions],
	)
}
