/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition, DefinitionType } from '@showwhy/types'
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
	definitions: Definition[] = [],
): Definition[] {
	return definitions.filter(x => x.type === type)
}
