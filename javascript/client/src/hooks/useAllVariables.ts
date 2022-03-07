/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	Experiment,
	FactorsOrDefinitions,
} from '@showwhy/types'
import { useMemo } from 'react'

export function useAllVariables(
	causalFactors: CausalFactor[],
	defineQuestion: Experiment,
): FactorsOrDefinitions {
	return useMemo((): FactorsOrDefinitions => {
		const { population, exposure, outcome } = defineQuestion
		return causalFactors.concat(
			...(population?.definition || []),
			...(exposure?.definition || []),
			...(outcome?.definition || []),
		)
	}, [causalFactors, defineQuestion])
}
