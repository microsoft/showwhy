/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 } from 'uuid'
import { SetDefinitions } from './types'
import { DefinitionType } from '~enums'
import { ElementDefinition } from '~interfaces'
import { GenericFn } from '~types'

export const useAddDefinition = (
	setDefinitions: SetDefinitions,
	saveDefinitions: GenericFn,
	definitions?: ElementDefinition[],
): GenericFn => {
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			const isPrimary = definition.level === DefinitionType.Primary
			const newDefinition = {
				...definition,
				id: v4(),
			} as ElementDefinition
			let newDefinitions = definitions ? [...definitions] : []
			if (isPrimary) {
				newDefinitions = newDefinitions.map(x => {
					return { ...x, level: DefinitionType.Secondary }
				})
			}
			newDefinitions.push(newDefinition)
			setDefinitions(newDefinitions)
			saveDefinitions(newDefinitions)
		},
		[setDefinitions, saveDefinitions, definitions],
	)
}
