/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetDefinitions } from './types'
import { ElementDefinition } from '~types'

export function useRemoveDefinition(
	setDefinitions: SetDefinitions,
	saveDefinitions: (definitions: ElementDefinition[]) => void,
	definitions?: ElementDefinition[],
): (definition: ElementDefinition) => void {
	return useCallback(
		(definition: ElementDefinition) => {
			setDefinitions(() => {
				const newDefinitions =
					definitions?.filter(def =>
						definition.id
							? def.id !== definition.id
							: def.variable !== definition.variable &&
							  def.level !== definition.level,
					) || []
				saveDefinitions(newDefinitions)
				return newDefinitions
			})
		},
		[definitions, setDefinitions, saveDefinitions],
	)
}
