/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	Pipeline,
	Specification,
	Step,
	TableContainer,
	TableStore,
} from '@data-wrangling-components/core'
import { usePipeline, useStore } from '@data-wrangling-components/react'
import type { BaseFile } from '@data-wrangling-components/utilities'
import type {
	CausalFactor,
	ElementDefinition,
	Maybe,
	RunHistory,
} from '@showwhy/types'
import { StepStatus } from '@showwhy/types'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import {
	useAddFilesToCollection,
	useGetStepUrls,
	useSetRunAsDefault,
} from '~hooks'
import {
	useSetCausalFactors,
	useSetConfidenceInterval,
	useSetConfigJson,
	useSetDefaultDatasetResult,
	useSetDefinitions,
	useSetEstimators,
	useSetExperiment,
	useSetOutputTablePrep,
	useSetPrimarySpecificationConfig,
	useSetProjectFiles,
	useSetRefutationCount,
	useSetRunHistory,
	useSetSignificanceTest,
	useSetStepStatuses,
	useSetSubjectIdentifier,
	useSetTablesPrepSpecification,
} from '~state'
import type {
	DataTableFileDefinition,
	FileDefinition,
	ProjectFile,
	Workspace,
	ZipData,
} from '~types'
import { ProjectSource } from '~types'
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
	const setDefinitions = useSetDefinitions()
	const setDefineQuestion = useSetExperiment()
	const setEstimators = useSetEstimators()
	const setRefutationCount = useSetRefutationCount()
	const setFiles = useSetProjectFiles()
	const setConfidenceInterval = useSetConfidenceInterval()
	const setDefaultDatasetResult = useSetDefaultDatasetResult()
	const getStepUrls = useGetStepUrls()
	const setAllStepStatus = useSetStepStatuses()
	const updateCollection = useUpdateCollection()
	const updateRunHistory = useUpdateRunHistory()
	const setSignificanceTests = useSetSignificanceTest()
	const setTablePrepSpec = useSetTablesPrepSpecification()
	const setOutputTablePrep = useSetOutputTablePrep()
	const store = useStore()
	const pipeline = usePipeline(store)
	const setConfigJson = useSetConfigJson()

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
				significanceTests = [],
			} = zip as ZipData

			const {
				primarySpecification,
				causalFactors,
				definitions,
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
			const df = prepDefinitions(definitions)
			const est = estimators || []
			const tps = prepTablesSpec(tablesPrep)
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)
			refutations && setRefutationCount(refutations)

			setCausalFactors(cfs)
			setDefinitions(df)
			setDefineQuestion(defineQuestion)
			setEstimators(est)
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
			setSignificanceTests(significanceTests)
			setConfigJson(workspace)
		},
		[
			source,
			setFiles,
			setPrimarySpecificationConfig,
			setCausalFactors,
			setDefineQuestion,
			setEstimators,
			setRefutationCount,
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
			setConfigJson,
			setSignificanceTests,
			setDefinitions,
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
		// Turning autoType on by default for demo
		table.autoType = true
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

			const file = {
				name: table.name,
				id: table.name,
				table: resultTable,
				autoType: !!table.autoType,
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
				name: table.name,
				table: result,
				autoType: !!table.autoType,
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
	if (tps !== undefined && tps[0]?.steps?.length && projectFiles?.length) {
		const steps = tps[0]?.steps as Step[]
		pipeline.clear()
		return await runPipelineFromProjectFiles(projectFiles, steps, pipeline)
	}
	return undefined
}

function prepCausalFactors(factors?: Partial<CausalFactor>[]): CausalFactor[] {
	return (factors || []).map(withRandomId) as CausalFactor[]
}

function prepDefinitions(
	definitions: ElementDefinition[],
): ElementDefinition[] {
	return definitions.map(withRandomId)
}

function prepTablesSpec(specifications?: Specification[]): Specification[] {
	return specifications as Specification[]
}

function useUpdateCollection(): (
	workspace: Workspace,
	tableFiles: BaseFile[],
	notebooks: BaseFile[],
) => Promise<void> {
	const addToCollection = useAddFilesToCollection()

	return useCallback(
		async (workspace: Workspace, tableFiles = [], notebooks = []) => {
			const { name, tables = [], defaultResult } = workspace
			const fetched = await fetchRemoteTables(tables)
			await addToCollection([...fetched, ...tableFiles, ...notebooks], name)
			if (defaultResult) {
				const resultTable: DataTableFileDefinition = {
					...(defaultResult || {}),
					name: 'results.csv',
				}
				const fetched = await fetchRemoteTables([resultTable])
				if (fetched.length) {
					await addToCollection(fetched)
				}
			}
		},
		[addToCollection],
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
