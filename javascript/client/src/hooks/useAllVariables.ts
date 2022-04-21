/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
	FactorsOrDefinitions,
} from '@showwhy/types'
import { useMemo } from 'react'

export function useAllVariables(
	causalFactors: CausalFactor[],
	definitions: ElementDefinition[],
): FactorsOrDefinitions {
	return useMemo((): FactorsOrDefinitions => {
		return causalFactors.concat([...definitions])
	}, [causalFactors, definitions])
}
