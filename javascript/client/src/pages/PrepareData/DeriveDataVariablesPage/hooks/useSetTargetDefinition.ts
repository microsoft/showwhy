/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { useCallback } from 'react'

export function useSetTargetDefinition(
	saveDefinition: (definition: ElementDefinition | ElementDefinition) => void,
	definitions: ElementDefinition[],
): (selectedDefinitionId: string, column: string) => boolean {
	return useCallback(
		(selectedDefinitionId: string, column: string) => {
			const all: ElementDefinition[] = [...definitions]

			const newDefinition = {
				...all?.find(x => x.id === selectedDefinitionId),
			} as ElementDefinition

			if (newDefinition) {
				newDefinition.column =
					newDefinition.column === column ? undefined : column
			}

			saveDefinition(newDefinition)
			return !!newDefinition.column
		},
		[saveDefinition, definitions],
	)
}
