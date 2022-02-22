/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	runPipeline,
	Specification,
	Step,
} from '@data-wrangling-components/core'
import cloneDeep from 'lodash/cloneDeep'
import isArray from 'lodash/isArray'
import { useCallback, useMemo } from 'react'
import {
	useAllVariables,
	useOutputTableModelVariables,
	useOutputTablePrep,
	useSetOrUpdateAllVariables,
	useSetOutputTableModelVariables,
	useSubjectIdentifier,
} from '~state'
import {
	useColumnsPrepSpecification,
	useSetColumnsPrepSpecification,
} from '~state/columnsPrepSpecification'
import { Maybe, TransformTable, VariableDefinition } from '~types'
import { useViewTable } from './useViewTable'

export function useTableTransform(
	selectedDefinitionId: string,
): TransformTable {
	const columnsPrep = useColumnsPrepSpecification()
	const setColumnsPrep = useSetColumnsPrepSpecification()
	const allVariables = useAllVariables()
	const setVariables = useSetOrUpdateAllVariables()
	const outputTable = useOutputTableModelVariables()
	const tablePrep = useOutputTablePrep()
	const setOutp = useSetOutputTableModelVariables()
	const subjectIdentifier = useSubjectIdentifier()

	const selectedVariable = useMemo((): VariableDefinition | undefined => {
		return allVariables.find(x => x.id === selectedDefinitionId)
	}, [allVariables, selectedDefinitionId])

	const selectedSpecification = useMemo((): Maybe<Specification> => {
		return columnsPrep[0] || undefined
	}, [columnsPrep])

	const selectedColumns = useMemo((): string[] => {
		return selectedVariable?.columns || []
	}, [selectedVariable])

	const outputViewTable = useViewTable(
		selectedDefinitionId,
		selectedColumns,
		outputTable,
		subjectIdentifier,
	)

	const actualSteps = useMemo((): Step[] => {
		return (
			selectedSpecification?.steps?.filter(a => {
				const args = a.args as Record<string, unknown>
				if (!isArray(args['to'])) {
					return selectedColumns?.includes(args['to'] as string)
				}
			}) || []
		)
	}, [selectedSpecification, selectedColumns])

	const handleTransformRequested = useCallback(
		async (step: Step, index?: number) => {
			if (outputTable && step) {
				//if add, just run on top of it
				//if edit or delete, run everything
				const tab = index != undefined && tablePrep ? tablePrep : outputTable
				//if index, run all steps
				let spec = cloneDeep(selectedSpecification) || {}
				const args = step.args as Record<string, unknown>
				let columns = [...(selectedVariable?.columns || [])]
				let output = tab
				let inde = undefined
				if (index != undefined && spec.steps) {
					const bb = actualSteps[index]
					inde = spec.steps?.findIndex(
						x => JSON.stringify(x) === JSON.stringify(bb),
					)
					spec.steps[inde] = step
					output = await runPipeline(tab, spec.steps)
					columns = columns.filter(x => output.columnNames().includes(x))
					columns?.push(args['to'] as string)
				} else {
					output = await runPipeline(tab, [step])
					spec = {
						...spec,
						steps: [...(spec?.steps || []), step],
					}
					columns?.push(args['to'] as string)
				}
				const variableDefinition = {
					id: selectedDefinitionId,
					columns: columns,
				}
				setOutp(output)
				setVariables(variableDefinition)
				setColumnsPrep([spec])
			}
		},
		[
			tablePrep,
			outputTable,
			setOutp,
			selectedDefinitionId,
			setVariables,
			setColumnsPrep,
			selectedSpecification,
			selectedVariable,
		],
	)

	const onDeleteStep = useCallback(
		async (index: number) => {
			let spec = cloneDeep(columnsPrep[0])

			const bb = actualSteps[index]
			const inde = spec.steps?.findIndex(
				x => JSON.stringify(x) === JSON.stringify(bb),
			)
			if (inde != undefined && spec.steps && tablePrep) {
				let columns = [...(selectedVariable?.columns || [])]
				delete spec.steps[inde]
				spec.steps = spec.steps.filter(x => x)
				const output = spec.steps
					? await runPipeline(tablePrep, spec.steps)
					: tablePrep
				columns = columns.filter(x => output.columnNames().includes(x))
				const aa = {
					id: selectedDefinitionId,
					columns: columns,
				}
				setOutp(output)
				setVariables(aa)
				setColumnsPrep(spec.steps ? [spec] : [])
			}
		},
		[selectedVariable, actualSteps, tablePrep, selectedDefinitionId],
	)

	return {
		actualSteps,
		outputViewTable,
		handleTransformRequested,
		outputTable,
		onDeleteStep,
	}
}
