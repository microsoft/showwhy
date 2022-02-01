/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { v4 } from 'uuid'
import { CausalityLevel, ElementDefinition, Setter } from '~types'

export function useAddDefinition(
	setDefinitions: Setter<ElementDefinition[]>,
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	definitions?: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			if (!definition.variable?.length) {
				return
			}
			const isPrimary = definition.level === CausalityLevel.Primary
			const newDefinition = {
				...definition,
				id: v4(),
			} as ElementDefinition
			let newDefinitions = definitions ? [...definitions] : []
			if (isPrimary) {
				newDefinitions = newDefinitions.map(x => {
					return { ...x, level: CausalityLevel.Secondary }
				})
			}
			newDefinitions.push(newDefinition)
			setDefinitions(newDefinitions)
			saveDefinitions(newDefinitions)
		},
		[setDefinitions, saveDefinitions, definitions],
	)
}
