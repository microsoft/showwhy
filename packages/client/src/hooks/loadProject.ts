/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { useCallback, useMemo } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { StepStatus } from '~enums'
import { useGetStepUrls } from '~hooks'
import {
	CausalFactor,
	Definition,
	DescribeElements,
	Element,
	ElementDefinition,
	FileDefinition,
	FilterObject,
	ProjectFile,
	TableColumn,
	VariableDefinition,
	Workspace,
} from '~interfaces'
import {
	useAddProjectFile,
	useSetCausalFactors,
	useSetConfidenceInterval,
	useSetDefaultDatasetResult,
	useSetDefineQuestion,
	useSetEstimators,
	useSetModelVariables,
	useSetOrUpdateOriginalTable,
	useSetPrimarySpecificationConfig,
	useSetRefutationType,
	useSetStepStatuses,
	useSetTableColumns,
} from '~state'
import { fetchTable, runPipeline } from '~utils'

export function useLoadProject() {
	const id = useMemo(() => uuidv4(), [])
	const setTableColumns = useSetTableColumns(id)
	const setModelVariables = useSetModelVariables(id)
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setDefineQuestion = useSetDefineQuestion()
	const setOrUpdateEst = useSetEstimators()
	const setRefutationType = useSetRefutationType()
	const addFile = useAddProjectFile()
	const setOriginalTable = useSetOrUpdateOriginalTable()
	const setConfidenceInterval = useSetConfidenceInterval()
	const setDefaultDatasetResult = useSetDefaultDatasetResult()

	const getStepUrls = useGetStepUrls()
	const setAllStepStatus = useSetStepStatuses()

	return useCallback(
		async (definition: FileDefinition) => {
			const workspace = (await fetch(definition.url)
				.then(res => res.json())
				.then(wks => ({
					...wks,
					name: definition.name,
				}))) as Workspace

			const {
				primarySpecification,
				causalFactors,
				defineQuestion,
				estimators,
				refutations,
				tableColumns,
				modelVariables,
				confidenceInterval,
				defaultResult,
			} = workspace

			// prep everything as needed to ensure partials from the JSON
			// have required fields
			const cfs = prepCausalFactors(causalFactors)
			const df = prepDefineQuestion(defineQuestion)
			const est = estimators || []
			const tcs = prepTableColumns(tableColumns)
			const mvs = prepModelVariables(modelVariables)
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)
			refutations && setRefutationType(refutations)

			setCausalFactors(cfs)
			setDefineQuestion(df)
			setOrUpdateEst(est)
			setTableColumns(tcs)
			setModelVariables(mvs)
			setDefaultDatasetResult(defaultDatasetResult)
			setConfidenceInterval(!!confidenceInterval)

			await processTables(workspace, id, addFile, setOriginalTable)

			const completed = getStepUrls(workspace.todoPages, true)
			setAllStepStatus(completed, StepStatus.Done)
		},
		[
			id,
			setOriginalTable,
			addFile,
			setPrimarySpecificationConfig,
			setCausalFactors,
			setDefineQuestion,
			setOrUpdateEst,
			setRefutationType,
			setTableColumns,
			setModelVariables,
			setAllStepStatus,
			getStepUrls,
			setDefaultDatasetResult,
		],
	)
}

// HACK: this is pretty kludgy, just to wrap up some weird load logic in a single spot
// things we should be able to do cleanly:
// 1: load any number of tables into the system
// 2: apply a post-load pipeline to any combination of tables
// 3: specify which tables to display to the user for usage in the model
// right now we need only one final table to submit, but don't provide enough data wrangling to enable anything complex.
async function processTables(
	workspace: Workspace,
	id: string,
	addFile,
	setOriginalTable,
) {
	const { tables, postLoad } = workspace

	// if we have a post-load,
	// run it and save just the final result
	// otherwise, only save the primary table
	if (postLoad) {
		const result = await runPipeline(tables, postLoad.steps)
		const file: ProjectFile = {
			id,
			content: result.toCSV(),
			name: workspace.name,
		}
		addFile(file)
		setOriginalTable({ tableId: id, columns: result })
	} else {
		// this effectively uses a "first one wins" for the primary table
		// this shouldn't actually happen in practice, but until we can support multiples correctly...
		const primary = tables.find(table => table.primary)
		if (primary) {
			const result = await fetchTable(primary)
			const file: ProjectFile = {
				id,
				content: result.toCSV(),
				name: primary.name,
			}
			addFile(file)
			setOriginalTable({ tableId: id, columns: result })
		}
	}
}

function prepCausalFactors(factors?: Partial<CausalFactor>[]): CausalFactor[] {
	return (factors || []).map(
		factor =>
			({
				id: uuidv4(),
				...factor,
			} as CausalFactor),
	)
}

function prepDefineQuestion(
	define?: Partial<DescribeElements>,
): DescribeElements {
	const prepped = { ...define }
	if (prepped.exposure) {
		prepped.exposure = prepElement(prepped.exposure)
	}
	if (prepped.population) {
		prepped.population = prepElement(prepped.population)
	}
	if (prepped.outcome) {
		prepped.outcome = prepElement(prepped.outcome)
	}

	return prepped as DescribeElements
}

function prepModelVariables(model?: Partial<Definition>): Definition {
	const prepped = { ...model }
	if (prepped.exposure) {
		prepped.exposure = prepVariableDefinitions(prepped.exposure)
	}
	if (prepped.population) {
		prepped.population = prepVariableDefinitions(prepped.population)
	}
	if (prepped.outcome) {
		prepped.outcome = prepVariableDefinitions(prepped.outcome)
	}
	if (prepped.control) {
		prepped.control = prepVariableDefinitions(prepped.control)
	}

	return prepped as Definition
}

function prepVariableDefinitions(
	definitions?: Partial<VariableDefinition>[],
): VariableDefinition[] {
	return (definitions || []).map(
		definition =>
			({
				...definition,
				filters: (definition?.filters || []).map(
					d =>
						({
							id: uuidv4(),
							...(d as Partial<FilterObject>),
						} as FilterObject),
				),
			} as VariableDefinition),
	)
}

function prepElement(element: Element): Element {
	return {
		...element,
		definition: element.definition.map(
			d =>
				({
					id: uuidv4(),
					...(d as Partial<ElementDefinition>),
				} as ElementDefinition),
		),
	}
}

function prepTableColumns(columns?: Partial<TableColumn>[]): TableColumn[] {
	return (columns || []).map(
		column =>
			({
				id: uuidv4(),
				...column,
			} as TableColumn),
	)
}
