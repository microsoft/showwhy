/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { ElementDefinition } from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'

const causalFactorTypes = [
	DefinitionType.Confounders,
	DefinitionType.CauseExposure,
	DefinitionType.CauseOutcome,
]

export function isCausalFactorType(type: DefinitionType): boolean {
	return causalFactorTypes.includes(type)
}

export function getDefinitionsByType(
	type: DefinitionType,
	definitions: ElementDefinition[] = [],
): ElementDefinition[] {
	return definitions.filter(x => x.type === type)
}
