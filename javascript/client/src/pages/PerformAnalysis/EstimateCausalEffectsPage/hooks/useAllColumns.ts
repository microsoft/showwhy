/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, Experiment } from '@showwhy/types'
import { useMemo } from 'react'

export function useAllColumns(
	causalFactors?: CausalFactor[],
	defineQuestion?: Experiment,
): string[] {
	return useMemo((): string[] => {
		if (!defineQuestion) return []
		const definitions = defineQuestion.definitions?.map(x => x.column) || []
		const causalColumns = causalFactors?.map(x => x.column) || []
		const allColumns = causalColumns.concat(definitions)
		return allColumns.filter(c => c !== undefined) as string[]
	}, [causalFactors, defineQuestion])
}
