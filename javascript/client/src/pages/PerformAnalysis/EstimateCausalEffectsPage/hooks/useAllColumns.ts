/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { CausalFactor, ElementDefinition } from '@showwhy/types'
import { useMemo } from 'react'

export function useAllColumns(
	causalFactors?: CausalFactor[],
	definitions?: ElementDefinition[],
): string[] {
	return useMemo((): string[] => {
		if (!definitions?.length) return []
		const definitionCols = definitions?.map(x => x.column) || []
		const causalColumns = causalFactors?.map(x => x.column) || []
		const allColumns = causalColumns.concat(definitionCols)
		return allColumns.filter(c => c !== undefined) as string[]
	}, [causalFactors, definitions])
}
