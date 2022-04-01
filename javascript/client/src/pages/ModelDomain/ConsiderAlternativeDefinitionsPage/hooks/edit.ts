/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

import { updatedDefinitionList } from './updateDefinitions'

export function useEditDefinition(
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	definitions: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			let newDefinitions = updatedDefinitionList(definitions, definition)
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
