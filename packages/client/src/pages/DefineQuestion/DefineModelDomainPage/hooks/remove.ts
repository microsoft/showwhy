/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import { SetDefinitions } from './types'
import { ElementDefinition } from '~interfaces'
import { GenericFn } from '~types'

export const useRemoveDefinition = (
	setDefinitions: SetDefinitions,
	saveDefinitions: GenericFn,
	definitions?: ElementDefinition[],
): GenericFn => {
	return useCallback(
		(definition: ElementDefinition) => {
			setDefinitions(() => {
				const newDefinitions = definitions?.filter(def =>
					definition.id
						? def.id !== definition.id
						: def.variable !== definition.variable &&
						  def.level !== definition.level,
				)
				saveDefinitions(newDefinitions)
				return newDefinitions
			})
		},
		[definitions, setDefinitions, saveDefinitions],
	)
}
