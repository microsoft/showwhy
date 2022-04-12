/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

import { useSaveDefinitions } from '../ConsiderAlternativeDefinitionsPage.hooks'
import { updateListTypes } from '../ConsiderAlternativeDefinitionsPage.utils'

export function useEditDefinition(
	definitions: ElementDefinition[],
): (definition: ElementDefinition) => void {
	const saveDefinitions = useSaveDefinitions()
	return useCallback(
		(definition: ElementDefinition) => {
			let newDefinitions = updateListTypes(definitions, definition.type)
			newDefinitions = newDefinitions.map(d => {
				if (d.id === definition.id) {
					return { ...d, ...definition }
				}
				return d
			})
			saveDefinitions(newDefinitions)
			return newDefinitions
		},
		[saveDefinitions, definitions],
	)
}
