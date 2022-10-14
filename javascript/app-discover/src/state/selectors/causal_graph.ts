/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { DefaultValue, selector } from 'recoil'

import type { CausalVariable } from '../../domain/CausalVariable.js'
import { variablesForColumnNames } from '../../domain/Dataset.js'
import { InModelColumnNamesState } from '../atoms/index.js'
import { DatasetState } from './dataset.js'

export const InModelCausalVariablesState = selector<CausalVariable[]>({
	key: 'InModelCausalVariablesState',
	get({ get }) {
		const inModelColumnNames = get(InModelColumnNamesState)
		const dataset = get(DatasetState)
		return variablesForColumnNames(dataset, inModelColumnNames) // inModelColumnNames.filter(columnName => dataset.variables.has(columnName));
	},
	set({ set }, newValue) {
		const columnNames =
			newValue instanceof DefaultValue
				? newValue
				: newValue.map(variable => variable.columnName)
		set(InModelColumnNamesState, columnNames)
	},
})
