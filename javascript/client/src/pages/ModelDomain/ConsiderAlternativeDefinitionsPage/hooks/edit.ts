/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition, Maybe, Setter } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

export function useEditDefinition(
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>,
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	definitions: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			const isPrimary = definition.level === CausalityLevel.Primary
			const newDefinitions =
				definitions?.map(def => {
					if (isPrimary) {
						def = {
							...def,
							level: CausalityLevel.Secondary,
						}
					}
					if (def.id === definition.id) {
						def = {
							...def,
							...definition,
						}
					}
					return def
				}) || []
			saveDefinitions(newDefinitions)
			return newDefinitions
			setDefinitionToEdit(undefined)
		},
		[setDefinitionToEdit, saveDefinitions],
	)
}
