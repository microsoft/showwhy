/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

import { withRandomId } from '~utils'

import { useSaveDefinitions } from '../ConsiderAlternativeDefinitionsPage.hooks'
import { updateListTypes } from '../ConsiderAlternativeDefinitionsPage.utils'

export function useAddDefinition(
	definitions: ElementDefinition[],
): (definition: ElementDefinition) => void {
	const saveDefinitions = useSaveDefinitions()
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			definition = withRandomId(definition)
			let list = []
			if (definition.level === CausalityLevel.Primary) {
				list = [...updateListTypes(definitions, definition.type), definition]
			} else {
				list = [...definitions, definition]
			}
			saveDefinitions(list)
		},
		[saveDefinitions, definitions],
	)
}
