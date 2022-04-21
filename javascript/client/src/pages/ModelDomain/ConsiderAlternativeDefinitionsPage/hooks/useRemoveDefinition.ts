/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition } from '@showwhy/types'
import { useCallback } from 'react'

import { useSaveDefinitions } from '../ConsiderAlternativeDefinitionsPage.hooks'

export function useRemoveDefinition(
	definitions: Definition[],
): (definition: Definition) => void {
	const saveDefinitions = useSaveDefinitions()
	return useCallback(
		(definition: Definition) => {
			const newDefinitions =
				definitions?.filter(def => def.id !== definition.id) || []
			saveDefinitions(newDefinitions)
			return newDefinitions
		},
		[definitions, saveDefinitions],
	)
}
