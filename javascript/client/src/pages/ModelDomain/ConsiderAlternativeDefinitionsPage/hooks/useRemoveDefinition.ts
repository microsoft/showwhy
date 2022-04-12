/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

import { useSaveDefinitions } from './useSaveDefinition'

export function useRemoveDefinition(
	definitions: ElementDefinition[],
): (definition: ElementDefinition) => void {
	const saveDefinitions = useSaveDefinitions()
	return useCallback(
		(definition: ElementDefinition) => {
			const newDefinitions =
				definitions?.filter(def => def.id !== definition.id) || []
			saveDefinitions(newDefinitions)
			return newDefinitions
		},
		[definitions, saveDefinitions],
	)
}
