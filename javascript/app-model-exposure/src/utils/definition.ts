/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { OUTPUT_FILE_NAME } from '../pages/AnalyzeTestPage.constants.js'
import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import type { Definition } from '../types/experiments/Definition.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'

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
	return definitions.filter((x) => x.type === type)
}

export function isFullDatasetPopulation(definition: Definition): boolean {
	if (definition.type === DefinitionType.Population) {
		return definition.column === OUTPUT_FILE_NAME
	}
	return false
}
