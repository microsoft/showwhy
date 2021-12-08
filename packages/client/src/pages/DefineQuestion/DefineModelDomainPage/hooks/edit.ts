/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetDefinition, SetDefinitions } from './types'
import { DefinitionType } from '~enums'
import { ElementDefinition } from '~interfaces'
import { GenericFn } from '~types'

export const useEditDefinition = (
	setDefinitions: SetDefinitions,
	setDefinitionToEdit: SetDefinition,
	saveDefinitions: GenericFn,
): GenericFn => {
	return useCallback(
		(definition: ElementDefinition) => {
			const isPrimary = definition.level === DefinitionType.Primary
			setDefinitions(prev => {
				const definitions = prev?.map(def => {
					if (isPrimary) {
						def = {
							...def,
							level: DefinitionType.Secondary,
						}
					}
					if (def.id === definition.id) {
						def = {
							...def,
							...definition,
						}
					}
					return def
				})
				saveDefinitions(definitions)
				return definitions
			})
			setDefinitionToEdit(undefined)
		},
		[setDefinitions, setDefinitionToEdit, saveDefinitions],
	)
}
