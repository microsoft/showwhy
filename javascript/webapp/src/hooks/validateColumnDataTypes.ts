/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { CausalFactorType, DefinitionType } from '@showwhy/types'
import { useMemo } from 'react'
import { useAllVariables, useOutputTable } from '~hooks'
import { useCausalFactors, useDefinitions } from '~state'
import { assertDataType } from '~utils'

export function isColumnValid(
	data: any[],
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

		columnNames.forEach(column => {
			const variable = allVariables.find(v => v.column === column)
			if (variable?.type) {
				validColumns[column] = isColumnValid(
					table.array(column) as any[],
					variable.type,
				)
			}
		})
		const isValid = Object.values(validColumns).every(v => v)
		return [isValid, validColumns]
	}, [table, allVariables])
}
