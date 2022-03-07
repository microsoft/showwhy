/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Setter, Maybe, ElementDefinition } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'
import { useCallback } from 'react'

export function useEditDefinition(
	setDefinitions: Setter<ElementDefinition[]>,
	setDefinitionToEdit: Setter<Maybe<ElementDefinition>>,
	saveDefinitions: (definitions: ElementDefinition[]) => void,
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			const isPrimary = definition.level === CausalityLevel.Primary
			setDefinitions(prev => {
				const definitions =
					prev?.map(def => {
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
				saveDefinitions(definitions)
				return definitions
			})
			setDefinitionToEdit(undefined)
		},
		[setDefinitions, setDefinitionToEdit, saveDefinitions],
	)
}
