/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition } from '@showwhy/types'
import { useCallback } from 'react'

import { useSetDefinitions } from '~state'

import { saveDefinitions } from '../ConsiderAlternativeDefinitionsPage.utils'
export function useRemoveDefinition(
	definitions: Definition[],
): (definition: Definition) => void {
	const setDefinitions = useSetDefinitions()
	return useCallback(
		(definition: Definition) => {
			const newDefinitions =
				definitions?.filter(def => def.id !== definition.id) || []
			saveDefinitions(newDefinitions, definitions, setDefinitions)
			return newDefinitions
		},
		[definitions, setDefinitions],
	)
}
