/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { RowObject } from 'arquero/dist/types/table/table'
import type Table from 'arquero/dist/types/table/table'
import { memo } from 'react'
import type { VisualizationSpec } from 'react-vega'
import { Vega } from 'react-vega'

import { VariableNature } from '../../domain/VariableNature'
import { useVisualizationSpec } from './CategoricalChart.hooks.js'
import type { ChartProps } from './Chart.types.js'

export const CategoricalChart: React.FC<ChartProps> = memo(
	function CategoricalChart({ table, variable }) {
		const remapping: { [key: string]: string } = {}
		remapping[
			variable.columnName
		] = `(d, $) => op.recode(d['${variable.columnName}'], $.map, '?')`
		const column: Table = table.select(variable.columnName)

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		const mappedData: Table =
			variable.columnDataNature?.isString ||
			variable.nature === VariableNature.CategoricalNominal
				? column
				: // eslint-disable-next-line @typescript-eslint/no-unsafe-call
				  column.params({ map: variable.mapping }).derive(remapping)
		const preparedData: RowObject[] = mappedData.objects()
		const spec: VisualizationSpec = useVisualizationSpec(variable, preparedData)
		console.log('categorical', spec)
		return <Vega mode={'vega'} spec={spec} actions={false} renderer={'svg'} />
	},
)
