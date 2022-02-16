/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { CausalityLevel, ElementDefinition, Setter, Maybe } from '~types'
import { withRandomId } from '~utils'

export function useAddDefinition(
	setDefinitions: Setter<ElementDefinition[]>,
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	definitionList?: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			const newDefinition = withRandomId(definition)
			const newDefinitionList = updatedDefinitionList(
				definitionList,
				newDefinition,
			)
			setDefinitions(newDefinitionList)
			saveDefinitions(newDefinitionList)
		},
		[setDefinitions, saveDefinitions, definitionList],
	)
}

function updatedDefinitionList(
	definitions: Maybe<ElementDefinition[]>,
	newDefinition: ElementDefinition,
) {
	const isNewDefinitionPrimary = newDefinition.level === CausalityLevel.Primary
	let result = definitions ? [...definitions] : []

	// If the new definition is a primary cause, mark other elements as secondary causes
	if (isNewDefinitionPrimary) {
		result = result.map(d => ({ ...d, level: CausalityLevel.Secondary }))
	}
	result.push(newDefinition)
	return result
}
