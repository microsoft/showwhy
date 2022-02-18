/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	Specification,
	Step as FileStep,
} from '@data-wrangling-components/core'
import { BaseFile } from '@data-wrangling-components/utilities'
import { all, op } from 'arquero'
import ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useGetStepUrls, useSetRunAsDefault } from '~hooks'
import {
	useFileCollection,
	useSetCausalFactors,
	useSetConfidenceInterval,
	useSetDefaultDatasetResult,
	useSetDefineQuestion,
	useSetEstimators,
	useSetFileCollection,
	useSetPrimarySpecificationConfig,
	useSetRefutationType,
	useSetRunHistory,
	useSetStepStatuses,
	useSetSubjectIdentifier,
	useSetOutputTablePrep,
	useSetProjectFiles,
	useSetTablesPrepSpecification,
} from '~state'
import {
	ProjectSource,
	CausalFactor,
	Definition,
	Experiment,
	Element,
	ElementDefinition,
	FileDefinition,
	ZipData,
	ProjectFile,
	VariableDefinition,
	Workspace,
	DataTableFileDefinition,
	StepStatus,
	Handler1,
	Maybe,
	RunHistory,
} from '~types'
import {
	fetchRemoteTables,
	fetchTable,
	isZipUrl,
	loadTable,
	runPipeline,
	runPipelineFromProjectFiles,
} from '~utils'

export function useLoadProject(
	source = ProjectSource.url,
): (definition?: Maybe<FileDefinition>, zip?: Maybe<ZipData>) => Promise<void> {
	// const setModelVariables = useSetModelVariables(id)
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefineQuestion = useSetDefineQuestion()
	const setOrUpdateEst = useSetEstimators()
	const setRefutationType = useSetRefutationType()
	const setFiles = useSetProjectFiles()
	const setConfidenceInterval = useSetConfidenceInterval()
	const setDefaultDatasetResult = useSetDefaultDatasetResult()
	const getStepUrls = useGetStepUrls()
	const setAllStepStatus = useSetStepStatuses()
	const updateCollection = useUpdateCollection()
	const updateRunHistory = useUpdateRunHistory()
	const setTablePrepSpec = useSetTablesPrepSpecification()
	const setOutputTablePrep = useSetOutputTablePrep()

	return useCallback(
		async (definition?: FileDefinition, zip: ZipData = {}) => {
			if (!definition && !zip) {
				throw new Error('Must provide either a definition or .zip file')
			}

			let workspace: any

			if (source === ProjectSource.zip) {
				const { json, name } = zip as ZipData
				workspace = {
					...json,
					name,
				}
			} else {
				workspace = (await fetch(definition?.url as string)
					.then(res => res.json())
					.then(wks => ({
						...wks,
						name: definition?.name,
					}))) as Workspace
			}

			const {
				tables = [],
				results,
				notebooks = [],
				runHistory = [],
			} = zip as ZipData

			const {
				primarySpecification,
				causalFactors,
				defineQuestion,
				estimators,
				refutations,
				subjectIdentifier,
				modelVariables,
				confidenceInterval,
				defaultResult,
				tablesPrep,
			} = workspace

			if (results && defaultResult) {
				defaultResult.url = results?.dataUri
			}

			// prep everything as needed to ensure partials from the JSON
			// have required fields
			const cfs = prepCausalFactors(causalFactors)
			const df = prepDefineQuestion(defineQuestion)
			const est = estimators || []
			const mvs = prepModelVariables(modelVariables)
			const tps = prepTablesSpec(tablesPrep)
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)
			refutations && setRefutationType(refutations)

			setCausalFactors(cfs)
			setDefineQuestion(df)
			setOrUpdateEst(est)
			setSubjectIdentifier(subjectIdentifier)
			// setModelVariables(mvs)
			setTablePrepSpec(tps)
			setDefaultDatasetResult(defaultDatasetResult)
			setConfidenceInterval(!!confidenceInterval)

			const processedTablesPromise = preProcessTables(
				workspace,
				tables as File[],
			)
			const processedTables = await Promise.all(processedTablesPromise)
			setFiles(processedTables)

			await processDataTables(setOutputTablePrep, tps, processedTables)

			const completed = getStepUrls(workspace.todoPages, true)
			setAllStepStatus(completed, StepStatus.Done)
			updateCollection(workspace, tables, notebooks)
			updateRunHistory(runHistory)
		},
		[
			// id,
			source,
			setFiles,
			setPrimarySpecificationConfig,
			setCausalFactors,
			setDefineQuestion,
			setOrUpdateEst,
			setRefutationType,
			setSubjectIdentifier,
			// setModelVariables,
			setAllStepStatus,
			getStepUrls,
			setDefaultDatasetResult,
			setConfidenceInterval,
			updateCollection,
			updateRunHistory,
			setTablePrepSpec,
			setOutputTablePrep,
		],
	)
}

// HACK: this is pretty kludgy, just to wrap up some weird load logic in a single spot
// things we should be able to do cleanly:
// 1: load any number of tables into the system
// 2: apply a post-load pipeline to any combination of tables
// 3: specify which tables to display to the user for usage in the model
// right now we need only one final table to submit, but don't provide enough data wrangling to enable anything complex.
function preProcessTables(workspace: Workspace, tableFiles?: File[]) {
	const { tables, postLoad } = workspace

	return tables.map(async table => {
		const stepPostLoad =
			!!postLoad?.length &&
			postLoad.find(p => p?.steps && p?.steps[0]?.input === table.name)
		if (stepPostLoad && stepPostLoad.steps) {
			const id = uuidv4()
			let result = await runPipeline(tables, stepPostLoad.steps, tableFiles)
			result = result.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			)

			const file: ProjectFile = {
				id,
				content: result.toCSV(),
				name: table.name,
				table: result,
			}
			return file
		} else {
			// 	// this effectively uses a "first one wins" for the primary table
			// 	// this shouldn't actually happen in practice, but until we can support multiples correctly...
			const id = uuidv4()

			//only loading one table
			const result = await (!isZipUrl(table.url)
				? fetchTable(table)
				: loadTable(table, tableFiles))

			const file: ProjectFile = {
				id,
				content: result.toCSV(),
				name: table.name,
				table: result,
			}
			return file
		}
	})
}

async function processDataTables(
	setOutputTablePrep: Handler1<ColumnTable>,
	tps?: Specification[],
	projectFiles?: ProjectFile[],
) {
	if (tps?.length && projectFiles?.length) {
		const steps = tps[0].steps as FileStep[]
		const output = await runPipelineFromProjectFiles(projectFiles, steps)
		setOutputTablePrep(output)
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

function prepDefineQuestion(define?: Partial<Experiment>): Experiment {
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

	return prepped as Experiment
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

function prepTablesSpec(specifications?: Specification[]): Specification[] {
	return specifications as Specification[]
}

function prepVariableDefinitions(
	definitions?: Partial<VariableDefinition>[],
): VariableDefinition[] {
	return (definitions || []).map(
		definition =>
			({
				...definition,
				// filters: (definition?.filters || []).map(
				// 	d =>
				// 		({
				// 			id: uuidv4(),
				// 			...(d as Partial<any>),
				// 		} as any),
				// ),
			} as VariableDefinition),
	)
}

function prepElement(element: Element): Element {
	return {
		...element,
		definition: element.definition?.map(
			d =>
				({
					id: uuidv4(),
					...(d as Partial<ElementDefinition>),
				} as ElementDefinition),
		),
	}
}

const useUpdateCollection = (): ((
	workspace: Workspace,
	tableFiles: BaseFile[],
	notebooks: BaseFile[],
) => Promise<void>) => {
	const setCollection = useSetFileCollection()
	const fileCollection = useFileCollection().copy()
	return useCallback(
		async (workspace: Workspace, tableFiles = [], notebooks = []) => {
			const { name, tables = [], defaultResult } = workspace
			const fetched = await fetchRemoteTables(tables)
			await fileCollection.add([...fetched, ...tableFiles, ...notebooks])
			if (defaultResult) {
				const resultTable: DataTableFileDefinition = {
					...(defaultResult || {}),
					name: 'results.csv',
				}
				const fetched = await fetchRemoteTables([resultTable])
				if (fetched.length) {
					await fileCollection.add(fetched)
				}
			}
			fileCollection.name = name || 'File Collection'
			setCollection(fileCollection)
		},
		[fileCollection, setCollection],
	)
}

function useUpdateRunHistory() {
	const setRunHistory = useSetRunHistory()
	const setDefaultRun = useSetRunAsDefault()
	return useCallback(
		(runHistory: RunHistory[]) => {
			if (!runHistory.length) {
				return
			}
			setRunHistory(runHistory)
			const defaultRun = runHistory.find(run => run.isActive) || runHistory[0]
			setDefaultRun(defaultRun)
		},
		[setRunHistory, setDefaultRun],
	)
}
