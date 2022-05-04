/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, DefinitionType } from '@showwhy/types'

import { getDefinitionsByType } from '../../../../utils'
import { useAddDefinition } from './useAddDefinition'
import { useEditDefinition } from './useEditDefinition'
import { useRemoveDefinition } from './useRemoveDefinition'

export function usePivotType(
	definitions: Definition[],
	definitionType: DefinitionType,
): {
	shouldHavePrimary: boolean
	addDefinition: (def: Definition) => void
	removeDefinition: (def: Definition) => void
	editDefinition: (def: Definition) => void
} {
	const shouldHavePrimary = !getDefinitionsByType(definitionType, definitions)
		.length
	const addDefinition = useAddDefinition(definitions)
	const removeDefinition = useRemoveDefinition(definitions)
	const editDefinition = useEditDefinition(definitions)

	return {
		shouldHavePrimary,
		editDefinition,
		addDefinition,
		removeDefinition,
	}
}
