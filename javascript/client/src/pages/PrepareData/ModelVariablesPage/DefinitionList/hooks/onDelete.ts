/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	Definition,
	ElementDefinition,
} from '@showwhy/types'
import { useCallback } from 'react'
import type { SetModelVariables } from './types'
import { PageType } from '~types'

export function useOnDelete({
	modelVariables,
	type,
	setModelVariables,
	removeDefinition,
	deleteCausalFactor,
}: {
	modelVariables?: Definition
	type: string
	setModelVariables: SetModelVariables
	removeDefinition: (def: ElementDefinition) => void
	deleteCausalFactor: (factor: CausalFactor) => void
}): (val: CausalFactor) => void {
	return useCallback(
		(val: CausalFactor) => {
			if (type === PageType.Control) {
				return deleteCausalFactor(val as CausalFactor)
			}
			const existing = (modelVariables && modelVariables[type]) || []
			const actualVariables = existing.filter(x => x.name !== val.variable)
			const definitionObj = {
				...modelVariables,
				[type]: [...actualVariables],
			}
			setModelVariables(definitionObj)
			removeDefinition(val as ElementDefinition)
		},
		[
			modelVariables,
			type,
			setModelVariables,
			removeDefinition,
			deleteCausalFactor,
		],
	)
}
