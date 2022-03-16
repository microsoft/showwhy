/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	CausalFactor,
	ElementDefinition,
	FactorsOrDefinitions,
	Maybe,
} from '@showwhy/types'
import { useCallback, useMemo } from 'react'

export function useSelectedOptions(
	allElements: FactorsOrDefinitions,
): string[] {
	return useMemo((): string[] => {
		return allElements
			.filter((x: ElementDefinition | CausalFactor) => x.column)
			.map(x => x.variable)
	}, [allElements])
}

export function useSelectedOptionByColumnAndVariable(
	allElements: FactorsOrDefinitions,
): (
	text: string,
	columnName: string,
) => Maybe<ElementDefinition | CausalFactor> {
	return useCallback(
		(text: string, columnName: string) => {
			return allElements.find(
				(x: ElementDefinition | CausalFactor) =>
					x.variable === text && x.column === columnName,
			)
		},
		[allElements],
	)
}

export function useSelectedOptionByColumn(
	allElements: FactorsOrDefinitions,
): (columnName: string) => Maybe<ElementDefinition | CausalFactor> {
	return useCallback(
		(columnName: string) => {
			return allElements.find(
				(x: ElementDefinition | CausalFactor) => x.column === columnName,
			)
		},
		[allElements],
	)
}
