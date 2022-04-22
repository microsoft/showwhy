/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Definition } from '@showwhy/types'
import { useCallback } from 'react'
import type { SetterOrUpdater } from 'recoil'

import { replaceItemAtIndex } from '~utils/arrays'

export function useSaveDefinition(
	definitions: Definition[],
	setDefinitions: SetterOrUpdater<Definition[]>,
): (newDefinition: CausalFactor | Definition) => void {
	return useCallback(
		(newDefinition: CausalFactor | Definition) => {
			let newDefinitionList = [...definitions]

			const index = definitions?.findIndex(
				(x: Definition) => x.id === newDefinition?.id,
			)
			if (index > -1) {
				newDefinitionList = replaceItemAtIndex(
					newDefinitionList,
					index,
					newDefinition,
				)
			} else {
				newDefinitionList.push(newDefinition)
			}
			setDefinitions(newDefinitionList)
		},
		[definitions, setDefinitions],
	)
}
