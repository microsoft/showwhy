/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { Specification, Step } from '@data-wrangling-components/core'
import cloneDeep from 'lodash/cloneDeep'
import { useCallback, useEffect, useMemo } from 'react'
import { useViewTable } from './useViewTable'
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
import { Element, Maybe, TransformTable, VariableDefinition } from '~types'
import { useActualIndex, useActualSteps, useStartPipeline } from '.'
import {
	useFormatedColumnArgWithCount,
	usePipeline,
	useStore,
} from '@data-wrangling-components/react'
import { useHandleTransformRequested } from './useHandleTransformRequested'
import { isArray } from 'lodash'

export function useTableTransform(
	selectedDefinitionId: string,
): TransformTable {
	const columnsPrep = useColumnsPrepSpecification()
	const setColumnsPrep = useSetColumnsPrepSpecification()
	const allVariables = useAllVariables()
	const setVariables = useSetOrUpdateAllVariables()
	const outputTable = useOutputTableModelVariables()
	const setOutputTable = useSetOutputTableModelVariables()
	const tablePrep = useOutputTablePrep()
	const subjectIdentifier = useSubjectIdentifier()

	const store = useStore()
	const pipeline = usePipeline(store)

	const selectedVariable = useMemo((): VariableDefinition => {
		return (
			allVariables.find(x => x.id === selectedDefinitionId) ||
			({
				id: selectedDefinitionId,
			} as VariableDefinition)
		)
	}, [allVariables, selectedDefinitionId])

	const selectedSpecification = useMemo((): Maybe<Specification> => {
		return columnsPrep[0] || undefined
	}, [columnsPrep, selectedDefinitionId])

	const selectedColumns = useMemo((): string[] => {
		return selectedVariable?.columns || []
	}, [selectedVariable])

	const outputViewTable = useViewTable(
		selectedColumns,
		outputTable,
		subjectIdentifier,
	)

	const actualSteps = useActualSteps(selectedSpecification, selectedColumns)
	const startPipeline = useStartPipeline(pipeline, actualSteps, outputTable)
	const getActualIndex = useActualIndex(actualSteps)
	const formatColumnArgs = useFormatedColumnArgWithCount()

	useEffect(() => {
		startPipeline()
	}, [outputTable])

	const handleTransformRequested = useHandleTransformRequested(
		pipeline,
		actualSteps,
		selectedSpecification,
		selectedColumns,
		selectedVariable,
		setOutputTable,
		setVariables,
		setColumnsPrep,
	)

	const onDuplicateStep = useCallback(
		async (columnName: string) => {
			const step = selectedSpecification?.steps?.find(a => {
				const args = a.args as Record<string, unknown>
				if (!isArray(args['to'])) {
					return args['to'] === columnName
				}
				return false
			}) as Step

			let args = formatColumnArgs(step, outputTable?.columnNames() as string[])
			const _step = {
				...step,
				args,
			}

			pipeline.add(_step)
			const output = await pipeline.run()
			const columnTo = (_step.args as Record<string, unknown>).to as string
			let columns = [...(selectedColumns || [])]
			columns.push(columnTo)

			let specification = cloneDeep(selectedSpecification) || {}
			specification.steps?.push(_step)

			const variableA = {
				...selectedVariable,
				columns: columns,
			}

			setOutputTable(output)
			setVariables(variableA)
			setColumnsPrep([specification])
		},
		[
			selectedSpecification,
			selectedVariable,
			selectedColumns,
			outputTable,
			setOutputTable,
			setVariables,
			setColumnsPrep,
		],
	)

	const onDuplicateDefinition = useCallback(
		async (definitionId: string, newDefinition: string) => {
			const variable = allVariables.find(x => x.id === definitionId)
			const steps =
				selectedSpecification?.steps?.filter(a => {
					const args = a.args as Record<string, unknown>
					if (!isArray(args['to'])) {
						return variable?.columns?.includes(args['to'] as string)
					}
					return false
				}) || []

			const _steps = steps.map(s => {
				let args = formatColumnArgs(s, outputTable?.columnNames() as string[])

				return {
					...s,
					args,
				}
			})
			pipeline.addAll(_steps)
			const output = await pipeline.run()

			const newColumns = _steps.map(a => {
				const args = a.args as Record<string, unknown>
				return args['to']
			})

			const variableA = {
				id: newDefinition,
				columns: newColumns,
			} as VariableDefinition

			let specification = cloneDeep(selectedSpecification) || {}
			specification.steps?.push(..._steps)

			setOutputTable(output)
			setVariables(variableA)
			setColumnsPrep([specification])
		},
		[
			allVariables,
			selectedSpecification,
			outputTable,
			pipeline,
			setOutputTable,
			setVariables,
			setColumnsPrep,
		],
	)

	const onDeleteStep = useCallback(
		async (index: number) => {
			let specification = cloneDeep(selectedSpecification) || {}

			const actualIndex = getActualIndex(index, specification)
			if (specification.steps && tablePrep) {
				specification.steps.splice(actualIndex, 1)
				pipeline.clear()
				pipeline.addAll(specification.steps)
				pipeline.store.set('output', tablePrep)
				const output = specification.steps.length
					? await pipeline.run()
					: tablePrep
				setOutputTable(output)

				let columns = [...(selectedColumns || [])]
				columns = columns.filter(x => output.columnNames().includes(x))
				const variable = {
					...selectedVariable,
					columns: columns,
				}
				setVariables(variable)
				setColumnsPrep(specification.steps)
			}
		},
		[
			selectedSpecification,
			getActualIndex,
			setColumnsPrep,
			setVariables,
			tablePrep,
			selectedVariable,
			selectedColumns,
		],
	)

	return {
		actualSteps,
		outputViewTable,
		handleTransformRequested,
		outputTable,
		onDeleteStep,
		onDuplicateDefinition,
		onDuplicateStep,
	}
}
