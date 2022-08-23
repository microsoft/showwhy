/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Workflow, WorkflowObject } from '@datashaper/core'
import type { FileCollection, FileWithPath } from '@datashaper/utilities'
import { createFileWithPath, fetchFile, FileType } from '@datashaper/utilities'
import { isStatus } from '@showwhy/api-client'
import type {
	AsyncHandler,
	DataTableFileDefinition,
	Maybe,
	Question,
	Workspace,
} from '@showwhy/types'
import { DownloadType, NodeResponseStatus } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useGetStepUrlsByStatus } from '~hooks'
import {
	useCausalFactors,
	useConfidenceInterval,
	useConfigJson,
	useDefaultDatasetResult,
	useDefinitions,
	useEstimators,
	useFileCollection,
	usePrimarySpecificationConfig,
	useProjectFiles,
	useQuestion,
	useRefutationCount,
	useRunHistory,
	useSignificanceTest,
	useSubjectIdentifier,
	useWorkflow,
} from '~state'
import { isDataUrl } from '~utils'

import { getResult } from '../App.util'

export function useSaveProject(): AsyncHandler {
	const fileCollection = useFileCollection()
	const confidenceInterval = useConfidenceInterval()
	const primarySpecification = usePrimarySpecificationConfig()
	const causalFactors = useCausalFactors()
	const subjectIdentifier = useSubjectIdentifier()
	const question = useQuestion()
	const definitions = useDefinitions()
	const estimators = useEstimators()
	const refutations = useRefutationCount()
	const workflow = useWorkflow()
	const tablesPrep = getTablesPrep(workflow)
	const todoPages = useGetStepUrlsByStatus()({ exclude: true })
	const download = useDownload(fileCollection, question)

	return useCallback(async () => {
		const workspace: Partial<Workspace> = {
			primarySpecification,
			confidenceInterval,
			causalFactors,
			definitions,
			question,
			estimators,
			refutations,
			todoPages,
			subjectIdentifier,
			tablesPrep,
		}
		await download(workspace)
	}, [
		confidenceInterval,
		primarySpecification,
		causalFactors,
		definitions,
		question,
		estimators,
		refutations,
		todoPages,
		tablesPrep,
		subjectIdentifier,
		download,
	])
}

function useTables(fileCollection: FileCollection) {
	const projectFiles = useProjectFiles()
	const oldConfig = useConfigJson()
	return useCallback(() => {
		const files = fileCollection.list(FileType.table)
		const primary = oldConfig.tables?.find(t => t.primary)
		return files.map(file => {
			const isPrimary = files.length === 1 || file.name === primary?.name
			const project = projectFiles.find(p => p.name === file.name)
			const definition: DataTableFileDefinition = {
				url: `zip://${file.name}`,
				name: file.name,
				primary: isPrimary,
				autoType: !!project?.autoType,
			}
			if (project?.delimiter) {
				definition.delimiter = project.delimiter
			}
			if (!project?.loadedCorrectly) {
				definition.loadedCorrectly = false
			}
			return definition
		})
	}, [fileCollection, projectFiles, oldConfig])
}

function useResult(type?: DownloadType): Promise<Maybe<FileWithPath>> {
	const runHistory = useRunHistory()
	return useMemo(async () => {
		const completed = runHistory.find(
			run =>
				run.isActive && run.status?.status === NodeResponseStatus.Completed,
		)
		if (completed) {
			const options = {
				name:
					type === DownloadType.jupyter
						? DownloadType.jupyter
						: DownloadType.csv,
			}
			const result = await getResult(type)
			if (result) {
				return createFileWithPath(result, options)
			}
		}
		return undefined
	}, [runHistory, type])
}

function useCSVResult() {
	const defaultDatasetResult = useDefaultDatasetResult()
	const csvResult = useResult()
	return useMemo(async () => {
		const file = await csvResult
		if (file) {
			return {
				file,
				url: `zip://${file.name}`,
			}
		} else if (defaultDatasetResult?.url) {
			let { url } = defaultDatasetResult
			let file
			if (isDataUrl(defaultDatasetResult.url)) {
				const f = await fetchFile(defaultDatasetResult.url)
				file = createFileWithPath(f, { name: DownloadType.csv })
				url = `zip://${file.name}`
			}
			return {
				file,
				url,
			}
		}
	}, [defaultDatasetResult, csvResult])
}

function useRunHistoryFile(): Maybe<FileWithPath> {
	const rh = useRunHistory().filter(r =>
		isStatus(r?.status?.status, NodeResponseStatus.Completed),
	)
	return useMemo(() => {
		if (rh?.length) {
			const file = createFileWithPath(new Blob([JSON.stringify(rh, null, 4)]), {
				name: 'run_history.json',
			})
			return file
		}
		return undefined
	}, [rh])
}

function useSignificanceTestFile(): Maybe<FileWithPath> {
	const significanceTest = useSignificanceTest().filter(s =>
		isStatus(s?.status, NodeResponseStatus.Completed),
	)
	return useMemo(() => {
		if (significanceTest?.length) {
			const file = createFileWithPath(
				new Blob([JSON.stringify(significanceTest, null, 4)]),
				{
					name: 'significance_tests.json',
				},
			)
			return file
		}
		return undefined
	}, [significanceTest])
}

function getTablesPrep(workflow: Workflow): Maybe<WorkflowObject[]> {
	const [inputEntry] = [...(workflow?.input.entries() || [])]
	const input = inputEntry ? [inputEntry[0]] : ['']
	const output = [...(workflow?.output.entries() || [])]?.map(
		([, value]) => value,
	)

	return [
		{
			input,
			output,
			steps: workflow?.steps || [],
		},
	]
}

function useDownload(fileCollection: FileCollection, question: Question) {
	const csvResult = useCSVResult()
	const getTables = useTables(fileCollection)
	const notebookResult = useResult(DownloadType.jupyter)
	const runHistoryFile = useRunHistoryFile()
	const significanceTestsFile = useSignificanceTestFile()

	return useCallback(
		async (workspace: Partial<Workspace>) => {
			const tables = getTables()
			/* eslint-disable @essex/adjacent-await */
			const csv = await csvResult
			const notebook = await notebookResult
			workspace.tables = tables
			if (fileCollection.name) {
				workspace.name = fileCollection.name
			}
			if (csv?.url) {
				workspace.defaultResult = { url: csv.url }
			}
			const file = createFileWithPath(
				new Blob([JSON.stringify(workspace, null, 4)]),
				{ name: 'workspace_config.json' },
			)
			const files = [file].filter(t => !!t) as FileWithPath[]
			if (csv?.file) {
				files.push(csv.file)
			}
			if (notebook) {
				files.push(notebook)
			}
			if (runHistoryFile) {
				files.push(runHistoryFile)
			}
			if (significanceTestsFile) {
				files.push(significanceTestsFile)
			}
			const copy = fileCollection.copy()
			const { exposure, outcome } = question
			let zipName = copy.name
			if (exposure?.label && outcome?.label) {
				const formatLabel = (label: string) => label.trim().replace(/\s/g, '_')
				zipName = `ShowWhy_${formatLabel(exposure.label)}_causes_${formatLabel(
					outcome.label,
				)}_${new Date().toISOString()}`
			}
			/* eslint-disable @essex/adjacent-await */
			await copy.add(files)
			await copy.toZip(zipName)
		},
		[
			fileCollection,
			question,
			csvResult,
			getTables,
			notebookResult,
			runHistoryFile,
			significanceTestsFile,
		],
	)
}
