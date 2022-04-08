/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition, Maybe } from '@showwhy/types'
import { CausalityLevel } from '@showwhy/types'

export function updatedDefinitionList(
	defs: Maybe<ElementDefinition[]>,
	newDef: ElementDefinition,
): ElementDefinition[] {
	const isPrimary = defs?.find(
		d => d.type === newDef.type && d.level === CausalityLevel.Primary,
	)
	let result = defs ? [...defs] : []
	if (isPrimary) {
		result = result.map(d => {
			if (d.id === isPrimary.id) {
				return { ...d, level: CausalityLevel.Secondary }
			}
			return d
		})
	}
	return result
}
