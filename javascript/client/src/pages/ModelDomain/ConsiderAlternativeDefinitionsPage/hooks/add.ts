/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition, Maybe, Setter } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

import { withRandomId } from '~utils'

export function useAddDefinition(
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	defs?: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			const newDefs = updatedDefinitionList(defs, withRandomId(definition))
			saveDefinitions(newDefs)
		},
		[saveDefinitions, defs],
	)
}

function updatedDefinitionList(
	defs: Maybe<ElementDefinition[]>,
	newDef: ElementDefinition,
) {
	const isNewDefinitionPrimary = newDef.level === CausalityLevel.Primary
	let result = defs ? [...defs] : []

	// If the new definition is a primary cause, mark other elements as secondary causes
	if (isNewDefinitionPrimary) {
		result = result.map(d => ({ ...d, level: CausalityLevel.Secondary }))
	}
	result.push(newDef)
	return result
}
