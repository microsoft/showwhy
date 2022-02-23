/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Pipeline, Specification, Step } from '@data-wrangling-components/core'
import ColumnTable from 'arquero/dist/types/table/column-table'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback } from 'react'
import { Maybe, VariableDefinition } from '~types'
import { useActualIndex } from './useActualIndex'

export function useHandleTransformRequested(
	pipeline: Pipeline,
	actualSteps: Step[],
	selectedSpecification: Maybe<Specification>,
	selectedColumns: string[],
	selectedVariable: VariableDefinition,
	setOutputTable: (table: ColumnTable) => void,
	setVariables: (variable: VariableDefinition) => void,
	setColumnsPrep: (spec: Specification[]) => void,
) {
	const getActualIndex = useActualIndex(actualSteps)

	return useCallback(
		async (step: Step, index?: number) => {
			let specification = cloneDeep(selectedSpecification) || {}
			const args = step.args as Record<string, unknown>
			let columns = [...(selectedColumns || [])]

			step.input = 'output' //Fix this on dwc
			step.output = 'output'

			if (index !== undefined && specification.steps) {
				const actualIndex = getActualIndex(index, specification)
				pipeline.update(step, actualIndex)
				specification.steps[actualIndex] = step
			} else {
				pipeline.add(step)
				specification.steps?.push(step)
			}
			const output = await pipeline.run()
			columns = columns.filter(x => output.columnNames().includes(x))
			columns?.push(args['to'] as string)

			const variable = {
				...selectedVariable,
				columns: columns,
			}

			setOutputTable(output)
			setVariables(variable)
			setColumnsPrep([specification])
		},
		[
			getActualIndex,
			setOutputTable,
			setVariables,
			setColumnsPrep,
			pipeline,
			actualSteps,
			selectedSpecification,
			selectedVariable,
			selectedColumns,
		],
	)
}
