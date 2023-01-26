/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'

export function useAllColumns(
	causalFactors?: CausalFactor[],
	definitions?: Definition[],
): string[] {
	return useMemo((): string[] => {
		if (!definitions?.length) return []
		const definitionCols = definitions?.map((x) => x.column) || []
		const causalColumns = causalFactors?.map((x) => x.column) || []
		const allColumns = causalColumns.concat(definitionCols)
		return allColumns.filter((c) => c !== undefined) as string[]
	}, [causalFactors, definitions])
}
