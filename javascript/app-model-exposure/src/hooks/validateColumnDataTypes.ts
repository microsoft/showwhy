/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useMemo } from 'react'

import { useCausalFactors } from '../state/causalFactors.js'
import { useDefinitions } from '../state/definitions.js'
import { CausalFactorType } from '../types/causality/CausalFactorType.js'
import { DefinitionType } from '../types/experiments/DefinitionType.js'
import { assertDataType } from '../utils/assertDataType.js'
import { useAllVariables } from './useAllVariables.js'
import { useOutputTable } from './useOutputTable.js'

export function isColumnValid(
	data: any[], //eslint-disable-line
	type: DefinitionType | CausalFactorType,
): boolean {
	switch (type) {
		case DefinitionType.Population:
		case DefinitionType.Exposure:
			return assertDataType.isBinary(data)
		case DefinitionType.Outcome:
			return assertDataType.isNumerical(data) || assertDataType.isBinary(data)
		case CausalFactorType.Confounders:
			return (
				assertDataType.isNumerical(data) ||
				assertDataType.isBinary(data) ||
				assertDataType.isCategorical(data)
			)
		default:
			return true
	}
}

export function useIsDataTypeValid():
	| [boolean, Record<string, boolean>]
	| undefined {
	const causalFactors = useCausalFactors()
	const definitions = useDefinitions()
	const allVariables = useAllVariables(causalFactors, definitions)
	const table = useOutputTable()
	return useMemo(() => {
		if (!table) {
			return
		}
		const columnNames = table.columnNames()
		const validColumns: Record<string, boolean> = {}

		columnNames.forEach((column) => {
			const variable = allVariables.find((v) => v.column === column)
			if (variable?.type) {
				validColumns[column] = isColumnValid(
					table.array(column) as any[], //eslint-disable-line
					variable.type,
				)
			}
		})
		const isValid = Object.values(validColumns).every((v) => v)
		return [isValid, validColumns]
	}, [table, allVariables])
}
