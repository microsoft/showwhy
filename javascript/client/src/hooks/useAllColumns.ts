/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Experiment } from '@showwhy/types'
import { DefinitionType } from '@showwhy/types'
import { useMemo } from 'react'

import { getDefinitionsByType } from '../utils'

export function useAllColumns(
	causalFactors?: CausalFactor[],
	defineQuestion?: Experiment,
): string[] {
	return useMemo((): string[] => {
		if (!defineQuestion) return []
		// const { population, exposure, outcome } = defineQuestion
		const population = getDefinitionsByType(
			DefinitionType.Population,
			defineQuestion?.definitions,
		)
		const exposure = getDefinitionsByType(
			DefinitionType.Exposure,
			defineQuestion?.definitions,
		)
		const outcome = getDefinitionsByType(
			DefinitionType.Outcome,
			defineQuestion?.definitions,
		)
		const exposureColumns = exposure.map(x => x.column) || []
		const populationColumns = population.map(x => x.column) || []
		const outcomeColumns = outcome.map(x => x.column) || []
		const causalColumns = causalFactors?.map(x => x.column) || []
		const allColumns =
			causalColumns.concat(
				...exposureColumns,
				...populationColumns,
				...outcomeColumns,
			) || []
		return allColumns.filter(c => c !== undefined) as string[]
	}, [causalFactors, defineQuestion])
}
