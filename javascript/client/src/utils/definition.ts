/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { DefinitionType, ElementDefinition } from '@showwhy/types'
import { CausalFactorType } from '@showwhy/types'

const causalFactorTypes = [
	CausalFactorType.Confounders,
	CausalFactorType.CauseExposure,
	CausalFactorType.CauseOutcome,
]

export function isCausalFactorType(type: CausalFactorType): boolean {
	return causalFactorTypes.includes(type)
}

export function getDefinitionsByType(
	type: DefinitionType,
	definitions: ElementDefinition[] = [],
): ElementDefinition[] {
	return definitions.filter(x => x.type === type)
}
