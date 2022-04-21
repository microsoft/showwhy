/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	Definition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { useCallback, useMemo } from 'react'

export function useSelectedOptions(
	allElements: FactorsOrDefinitions,
): string[] {
	return useMemo((): string[] => {
		return allElements
			.filter((x: Definition | CausalFactor) => x.column)
			.map(x => x.variable)
	}, [allElements])
}

export function useSelectedOptionByColumnAndVariable(
	allElements: FactorsOrDefinitions,
): (text: string, columnName: string) => Maybe<Definition | CausalFactor> {
	return useCallback(
		(text: string, columnName: string) => {
			return allElements.find(
				(x: Definition | CausalFactor) =>
					x.variable === text && x.column === columnName,
			)
		},
		[allElements],
	)
}

export function useSelectedOptionByColumn(
	allElements: FactorsOrDefinitions,
): (columnName: string) => Maybe<Definition | CausalFactor> {
	return useCallback(
		(columnName: string) => {
			return allElements.find(
				(x: Definition | CausalFactor) => x.column === columnName,
			)
		},
		[allElements],
	)
}
