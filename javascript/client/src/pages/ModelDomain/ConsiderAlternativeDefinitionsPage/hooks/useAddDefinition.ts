/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

import { useExperiment } from '~state'
import { withRandomId } from '~utils'

import { useSaveDefinitions } from '../ConsiderAlternativeDefinitionsPage.hooks'
import { updateListTypes } from '../ConsiderAlternativeDefinitionsPage.utils'

export function useAddDefinition(): (definition: ElementDefinition) => void {
	const saveDefinitions = useSaveDefinitions()
	const defineQuestion = useExperiment()
	return useCallback(
		(definition: ElementDefinition) => {
			const definitions = [...(defineQuestion?.definitions || [])]
			if (!definition.variable?.length) {
				return
			}
			definition = withRandomId(definition)
			const newDefs = updateListTypes(definitions, definition.type)
			saveDefinitions([...newDefs, definition])
		},
		[saveDefinitions, defineQuestion],
	)
}
