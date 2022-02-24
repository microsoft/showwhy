/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Specification,
	Step as FileStep,
	TableStore,
	Pipeline,
	TableContainer,
} from '@data-wrangling-components/core'
import { usePipeline, useStore } from '@data-wrangling-components/react'
import type { BaseFile } from '@data-wrangling-components/utilities'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'
import { useGetStepUrls, useSetRunAsDefault } from '~hooks'
import {
	useFileCollection,
	useSetCausalFactors,
	useSetConfidenceInterval,
	useSetDefaultDatasetResult,
	useSetExperiment,
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
	Experiment,
	Element,
	FileDefinition,
	ZipData,
	ProjectFile,
	Workspace,
	DataTableFileDefinition,
	StepStatus,
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
	withRandomId,
} from '~utils'

export function useLoadProject(
	source = ProjectSource.url,
): (definition?: Maybe<FileDefinition>, zip?: Maybe<ZipData>) => Promise<void> {
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefineQuestion = useSetExperiment()
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
	const store = useStore()
	const pipeline = usePipeline(store)

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
			const tps = prepTablesSpec(tablesPrep)
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)
			refutations && setRefutationType(refutations)

			setCausalFactors(cfs)
			setDefineQuestion(df)
			setOrUpdateEst(est)
			setSubjectIdentifier(subjectIdentifier)
			setTablePrepSpec(tps)
			setDefaultDatasetResult(defaultDatasetResult)
			setConfidenceInterval(!!confidenceInterval)
			const processedTablesPromise = preProcessTables(
				workspace,
				store,
				pipeline,
				tables as File[],
			)
			const processedTables = await Promise.all(processedTablesPromise)
			setFiles(processedTables)

			const dataPrepTable = await processDataTables(
				pipeline,
				tps,
				processedTables,
			)
			setOutputTablePrep(dataPrepTable?.table)

			const completed = getStepUrls(workspace.todoPages, true)
			setAllStepStatus(completed, StepStatus.Done)
			updateCollection(workspace, tables, notebooks)
			updateRunHistory(runHistory)
		},
		[
			source,
			setFiles,
			setPrimarySpecificationConfig,
			setCausalFactors,
			setDefineQuestion,
			setOrUpdateEst,
			setRefutationType,
			setSubjectIdentifier,
			setAllStepStatus,
			getStepUrls,
			setDefaultDatasetResult,
			setConfidenceInterval,
			updateCollection,
			updateRunHistory,
			setTablePrepSpec,
			setOutputTablePrep,
			pipeline,
			store,
		],
	)
}

// HACK: this is pretty kludgy, just to wrap up some weird load logic in a single spot
// things we should be able to do cleanly:
// 1: load any number of tables into the system
// 2: apply a post-load pipeline to any combination of tables
// 3: specify which tables to display to the user for usage in the model
// right now we need only one final table to submit, but don't provide enough data wrangling to enable anything complex.
function preProcessTables(
	workspace: Workspace,
	store: TableStore,
	pipeline: Pipeline,
	tableFiles?: File[],
) {
	const { tables, postLoad } = workspace

	return tables.map(async table => {
		const stepPostLoad =
			!!postLoad?.length &&
			postLoad.find(p => p?.steps && p?.steps[0]?.input === table.name)
		if (stepPostLoad && stepPostLoad.steps) {
			const result = await runPipeline(
				tables,
				stepPostLoad.steps,
				store,
				pipeline,
				tableFiles,
			)

			const resultTable = result?.table?.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			) as ColumnTable

			const file: ProjectFile = {
				content: resultTable.toCSV(),
				name: table.name,
				id: table.name,
				table: resultTable,
			}
			return file
		} else {
			let result = await (!isZipUrl(table.url)
				? fetchTable(table)
				: loadTable(table, tableFiles))

			result = result.derive(
				{
					index: op.row_number(),
				},
				{ before: all() },
			)

			const file: ProjectFile = {
				id: table.name,
				content: result.toCSV(),
				name: table.name,
				table: result,
			}
			return file
		}
	})
}

async function processDataTables(
	pipeline: Pipeline,
	tps?: Specification[],
	projectFiles?: ProjectFile[],
): Promise<TableContainer | undefined> {
	if (tps !== undefined && projectFiles?.length) {
		const steps = tps[0]?.steps as FileStep[]
		pipeline.clear()
		return await runPipelineFromProjectFiles(projectFiles, steps, pipeline)
	}
	return undefined
}

function prepCausalFactors(factors?: Partial<CausalFactor>[]): CausalFactor[] {
	return (factors || []).map(withRandomId) as CausalFactor[]
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

function prepTablesSpec(specifications?: Specification[]): Specification[] {
	return specifications as Specification[]
}

function prepElement(element: Element): Element {
	return {
		...element,
		definition: element.definition?.map(withRandomId),
	}
}

function useUpdateCollection(): (
	workspace: Workspace,
	tableFiles: BaseFile[],
	notebooks: BaseFile[],
) => Promise<void> {
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
			const defaultRun = runHistory.find(run => run.isActive) || runHistory[0]!
			setDefaultRun(defaultRun)
		},
		[setRunHistory, setDefaultRun],
	)
}
