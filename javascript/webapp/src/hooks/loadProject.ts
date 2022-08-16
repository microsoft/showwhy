/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type {
	NamedPortBinding,
	PortBinding,
	WorkflowObject,
} from '@datashaper/core'
import { Workflow } from '@datashaper/core'
import type { BaseFile } from '@datashaper/utilities'
import type {
	CausalFactor,
	DataTableFileDefinition,
	Definition,
	FileDefinition,
	Maybe,
	ProjectFile,
	RunHistory,
	Workspace,
	ZipFileData,
} from '@showwhy/types'
import { ProjectSource, StepStatus } from '@showwhy/types'
import { all, op } from 'arquero'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback } from 'react'

import {
	useAddFilesToCollection,
	useGetStepUrls,
	useSetRunAsDefault,
} from '~hooks'
import {
	useOutput,
	useSetCausalFactors,
	useSetConfidenceInterval,
	useSetConfigJson,
	useSetDefaultDatasetResult,
	useSetDefinitions,
	useSetEstimators,
	useSetPrimarySpecificationConfig,
	useSetProjectFiles,
	useSetQuestion,
	useSetRefutationCount,
	useSetRunHistory,
	useSetSignificanceTest,
	useSetStepStatuses,
	useSetSubjectIdentifier,
	useSetTablesPrepSpecification,
	useWorkflowState,
} from '~state'
import {
	fetchRemoteTables,
	fetchTable,
	isZipUrl,
	loadTable,
	runWorkflow,
	withRandomId,
} from '~utils'

export function useLoadProject(
	source = ProjectSource.url,
): (
	definition?: Maybe<FileDefinition>,
	zip?: Maybe<ZipFileData>,
) => Promise<void> {
	const setPrimarySpecificationConfig = useSetPrimarySpecificationConfig()
	const setCausalFactors = useSetCausalFactors()
	const setSubjectIdentifier = useSetSubjectIdentifier()
	const setDefinitions = useSetDefinitions()
	const setQuestion = useSetQuestion()
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
	const setConfigJson = useSetConfigJson()
	const [, setWorkflow] = useWorkflowState()
	const [, setOutput] = useOutput()

	return useCallback(
		async (definition?: FileDefinition, zip: ZipFileData = {}) => {
			if (!definition && !zip) {
				throw new Error('Must provide either a definition or .zip file')
			}

			let workspace: any

			if (source === ProjectSource.zip) {
				const { json, name } = zip as ZipFileData
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
			} = zip as ZipFileData

			const {
				primarySpecification,
				causalFactors,
				definitions,
				question,
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
			const wf = prepWorkflow(tablesPrep)
			const defaultDatasetResult = defaultResult || null

			primarySpecification &&
				setPrimarySpecificationConfig(primarySpecification)
			refutations && setRefutationCount(refutations)

			setCausalFactors(cfs)
			setDefinitions(df)
			setQuestion(question)
			setEstimators(est)
			setSubjectIdentifier(subjectIdentifier)
			setTablePrepSpec(tablesPrep)
			setDefaultDatasetResult(defaultDatasetResult)
			setConfidenceInterval(!!confidenceInterval)
			const processedTablesPromise = preProcessTables(
				workspace,
				tables as File[],
			)
			const processedTables = await Promise.all(processedTablesPromise)
			setFiles(processedTables)
			setOutput(
				processedTables.map(t => ({ id: t.id || t.name, table: t.table })),
			)
			wf?.length && setWorkflow(wf[0] as Workflow)

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
			setQuestion,
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
			setConfigJson,
			setSignificanceTests,
			setDefinitions,
			setWorkflow,
			setOutput,
		],
	)
}

// HACK: this is pretty kludgy, just to wrap up some weird load logic in a single spot
// things we should be able to do cleanly:
// 1: load any number of tables into the system
// 2: apply a post-load workflow to any combination of tables
// 3: specify which tables to display to the user for usage in the model
// right now we need only one final table to submit, but don't provide enough data wrangling to enable anything complex.
function preProcessTables(workspace: Workspace, tableFiles?: File[]) {
	const { tables, postLoad } = workspace

	return tables.map(async table => {
		// Turning autoType on by default for demo
		table.autoType = true
		const postLoadWorkflow = getPostLoadWorkflow(postLoad, table.name)

		let content
		if (postLoadWorkflow?.steps) {
			const latestOutput = await runWorkflow(
				tables,
				tableFiles,
				postLoadWorkflow,
			)

			content = getDerivedTableContent(latestOutput?.table as ColumnTable)
			return formatTableDefinitionAsProjectFile(table, content)
		} else {
			content = await (!isZipUrl(table.url)
				? fetchTable(table)
				: loadTable(table, tableFiles))

			content = getDerivedTableContent(content)
		}

		return formatTableDefinitionAsProjectFile(table, content)
	})
}

function prepCausalFactors(factors?: Partial<CausalFactor>[]): CausalFactor[] {
	return (factors || []).map(withRandomId) as CausalFactor[]
}

function prepDefinitions(definitions: Definition[]): Definition[] {
	return definitions.map(withRandomId)
}

function prepWorkflow(workflowObject: WorkflowObject[] = []): Workflow[] {
	return workflowObject?.map(w => new Workflow(w))
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

function formatTableDefinitionAsProjectFile(
	table: DataTableFileDefinition,
	content: ColumnTable,
): ProjectFile {
	return {
		id: table.name,
		name: table.name,
		table: content,
		autoType: !!table.autoType,
		loadedCorrectly: table.loadedCorrectly ?? true,
		delimiter: table.delimiter,
	}
}

function getDerivedTableContent(content: ColumnTable): ColumnTable {
	return content.derive(
		{
			index: op.row_number(),
		},
		{ before: all() },
	)
}

function getPostLoadWorkflow(
	workflows: WorkflowObject[] = [],
	tableName: string,
): Maybe<WorkflowObject> {
	return workflows.find(p => {
		const input = p.steps?.length ? p.steps[0]?.input : undefined
		const source = input?.hasOwnProperty('source')
			? ((input as Record<string, PortBinding>)['source'] as NamedPortBinding)
					?.node
			: input
		return source === tableName
	})
}
