/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import {
	FileType,
	createFileWithPath,
	fetchFile,
	FileWithPath,
	FileCollection,
} from '@data-wrangling-components/utilities'
import { useCallback, useMemo } from 'react'
import { useGetResult, useGetStepUrlsByStatus } from '~hooks'
import {
	useCausalFactors,
	useConfidenceInterval,
	useDefineQuestion,
	useEstimators,
	usePrimarySpecificationConfig,
	useRefutationType,
	useProjectFiles,
	useAllModelVariables,
	useFileCollection,
	usePrimaryTable,
	useDefaultDatasetResult,
	useOriginalTables,
	useRunHistory,
	useSubjectIdentifier,
	useTablesPrepSpecification,
} from '~state'
import {
	PageType,
	Workspace,
	NodeResponseStatus,
	Maybe,
	AsyncHandler,
	DownloadType,
	DataTableFileDefinition,
} from '~types'
import { isDataUrl } from '~utils'

export function useSaveProject(): AsyncHandler {
	const fileCollection = useFileCollection()
	const confidenceInterval = useConfidenceInterval()
	const primarySpecification = usePrimarySpecificationConfig()
	const causalFactors = useCausalFactors()
	const subjectIdentifier = useSubjectIdentifier()
	const defineQuestion = useDefineQuestion()
	const estimators = useEstimators()
	const refutations = useRefutationType()
	const projectFiles = useProjectFiles()
	const tablesPrep = useTablesPrepSpecification()
	const todoPages = useGetStepUrlsByStatus()({ exclude: true })
	const [exposure] = useAllModelVariables(projectFiles, PageType.Exposure)
	const [outcome] = useAllModelVariables(projectFiles, PageType.Outcome)
	const [control] = useAllModelVariables(projectFiles, PageType.Control)
	const [population] = useAllModelVariables(projectFiles, PageType.Population)
	const modelVariables = useMemo(
		() => ({
			exposure,
			outcome,
			control,
			population,
		}),
		[exposure, outcome, control, population],
	)
	const download = useDownload(fileCollection)

	//TODO: Add postLoad steps into workspace
	return useCallback(async () => {
		const workspace: Partial<Workspace> = {
			primarySpecification,
			confidenceInterval,
			causalFactors,
			defineQuestion,
			estimators,
			refutations,
			modelVariables,
			todoPages,
			tablesPrep,
			subjectIdentifier,
		}
		await download(workspace)
	}, [
		confidenceInterval,
		primarySpecification,
		causalFactors,
		defineQuestion,
		estimators,
		refutations,
		modelVariables,
		todoPages,
		tablesPrep,
		subjectIdentifier,
		download,
	])
}

function usePrimary(): () => Maybe<FileWithPath> {
	const primaryTable = usePrimaryTable()
	const originalTables = useOriginalTables()
	return useCallback(() => {
		const ogTables = originalTables.find(
			file => file.tableId === primaryTable.id,
		)
		if (ogTables) {
			return createFileWithPath(new Blob([ogTables.table.toCSV()]), {
				name: `subject_${primaryTable.name}`,
			})
		}
	}, [primaryTable, originalTables])
}

function useTables(fileCollection: FileCollection) {
	const projectFiles = useProjectFiles()
	return useCallback(
		primary => {
			const files = fileCollection.list(FileType.table)
			if (primary) {
				files.push(primary)
			}
			return files.map(file => {
				const isPrimary = files.length === 1 || file.name === primary?.name
				const project = projectFiles.find(p => p.name === file.name)
				const definition: DataTableFileDefinition = {
					url: `zip://${file.name}`,
					name: file.name,
					primary: isPrimary,
				}
				if (project?.delimiter) {
					definition.delimiter = project.delimiter
				}
				return definition
			})
		},
		[fileCollection, projectFiles],
	)
}

function useResult(type?: DownloadType): Promise<Maybe<FileWithPath>> {
	const getResult = useGetResult()
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
	}, [getResult, runHistory, type])
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
	const rh = useRunHistory()
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

function useDownload(fileCollection: FileCollection) {
	const csvResult = useCSVResult()
	const getPrimary = usePrimary()
	const getTables = useTables(fileCollection)
	const notebookResult = useResult(DownloadType.jupyter)
	const runHistoryFile = useRunHistoryFile()
	return useCallback(
		async (workspace: Partial<Workspace>) => {
			const primary = getPrimary()
			const tables = getTables(primary)
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
			const files = [file, primary].filter(t => !!t) as FileWithPath[]
			if (csv?.file) {
				files.push(csv.file)
			}
			if (notebook) {
				files.push(notebook)
			}
			if (runHistoryFile) {
				files.push(runHistoryFile)
			}
			const copy = fileCollection.copy()
			/* eslint-disable @essex/adjacent-await */
			await copy.add(files)
			await copy.toZip()
		},
		[
			fileCollection,
			csvResult,
			getTables,
			getPrimary,
			notebookResult,
			runHistoryFile,
		],
	)
}
