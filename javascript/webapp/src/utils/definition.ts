/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Definition } from '@showwhy/types'
import { CausalFactorType, DefinitionType } from '@showwhy/types'

import { OUTPUT_FILE_NAME } from '~constants'

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

export function isFullDatasetPopulation(definition: Definition): boolean {
	if (definition.type === DefinitionType.Population) {
		return definition.column === OUTPUT_FILE_NAME
	}
	return true
}
