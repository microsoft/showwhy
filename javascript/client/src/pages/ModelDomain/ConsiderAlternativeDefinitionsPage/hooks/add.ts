/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

import { withRandomId } from '~utils'

import { updatedDefinitionList } from './updateDefinitions'

export function useAddDefinition(
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	defs?: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			definition = withRandomId(definition)
			const newDefs = updatedDefinitionList(defs, definition)
			saveDefinitions([...newDefs, definition])
		},
		[saveDefinitions, defs],
	)
}
