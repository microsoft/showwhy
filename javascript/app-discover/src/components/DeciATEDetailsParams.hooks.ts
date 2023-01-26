/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useMemo } from 'react'

import type { CausalVariable } from '../domain/CausalVariable.js'
import { VariableNature } from '../domain/VariableNature.js'

export function useFilteredCausalVariables(causalVariables: CausalVariable[]) {
	return useMemo(
		() =>
			causalVariables.filter(
				(v) =>
					v.nature === VariableNature.Continuous ||
					v.nature === VariableNature.Binary,
			),
		[causalVariables],
	)
}
