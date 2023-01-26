/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo } from 'react'

import type { CausalFactor } from '../../types/causality/CausalFactor.js'
import type { Definition } from '../../types/experiments/Definition.js'
import type { Maybe } from '../../types/primitives.js'

export function useSelectedOptions(
	allElements: CausalFactor[] | Definition[],
): string[] {
	return useMemo((): string[] => {
		return allElements
			.filter((x: Definition | CausalFactor) => x.column)
			.map((x) => x.variable)
	}, [allElements])
}

export function useSelectedOptionByColumnAndVariable(
	allElements: CausalFactor[] | Definition[],
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
	allElements: CausalFactor[] | Definition[],
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
