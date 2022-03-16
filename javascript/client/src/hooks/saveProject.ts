/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type {
	FileCollection,
	FileWithPath,
} from '@data-wrangling-components/utilities'
import {
	createFileWithPath,
	fetchFile,
	FileType,
} from '@data-wrangling-components/utilities'
import type { AsyncHandler, Experiment , Maybe } from '@showwhy/types'
import { NodeResponseStatus } from '@showwhy/types'
import { useCallback, useMemo } from 'react'

import { useGetResult, useGetStepUrlsByStatus } from '~hooks'
import {
	useCausalFactors,
	useConfidenceInterval,
	useConfigJson,
	useDefaultDatasetResult,
	useEstimators,
	useExperiment,
	useFileCollection,
	useOutputTablePrep,
	usePrimarySpecificationConfig,
	useProjectFiles,
	useRefutationType,
	useRunHistory,
	useSubjectIdentifier,
	useTablesPrepSpecification,
} from '~state'
import type { DataTableFileDefinition, Workspace } from '~types'
import { DownloadType } from '~types'
import { isDataUrl } from '~utils'

export function useSaveProject(): AsyncHandler {
	const fileCollection = useFileCollection()
	const confidenceInterval = useConfidenceInterval()
	const primarySpecification = usePrimarySpecificationConfig()
	const causalFactors = useCausalFactors()
	const subjectIdentifier = useSubjectIdentifier()
	const defineQuestion = useExperiment()
	const estimators = useEstimators()
	const refutations = useRefutationType()
	const tablesPrep = useTablesPrepSpecification()
	const todoPages = useGetStepUrlsByStatus()({ exclude: true })
	const download = useDownload(fileCollection, defineQuestion)
	const oldConfig = useConfigJson()

	return useCallback(async () => {
		const workspace: Partial<Workspace> = {
			primarySpecification,
			confidenceInterval,
			causalFactors,
			defineQuestion,
			estimators,
			refutations,
			todoPages,
			subjectIdentifier,
			tablesPrep,
			postLoad: oldConfig.postLoad,
		}
		await download(workspace)
	}, [
		confidenceInterval,
		primarySpecification,
		causalFactors,
		defineQuestion,
		estimators,
		refutations,
		todoPages,
		tablesPrep,
		subjectIdentifier,
		download,
		oldConfig,
	])
}

function useOutputTable(): Maybe<FileWithPath> {
	const outputTablePrep = useOutputTablePrep()
	return useMemo(() => {
		if (outputTablePrep) {
			return createFileWithPath(new Blob([outputTablePrep.toCSV()]), {
				name: 'output_table.csv',
			})
		}
		return undefined
	}, [outputTablePrep])
}

function useTables(fileCollection: FileCollection) {
	const projectFiles = useProjectFiles()
	const oldConfig = useConfigJson()
	return useCallback(
		output => {
			const files = fileCollection.list(FileType.table)
			const primary = oldConfig.tables?.find(t => t.primary)
			if (output) {
				files.push(output)
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
		[fileCollection, projectFiles, oldConfig],
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

function useDownload(fileCollection: FileCollection, defineQuestion: Experiment) {
	const csvResult = useCSVResult()
	const outputTable = useOutputTable()
	const getTables = useTables(fileCollection)
	const notebookResult = useResult(DownloadType.jupyter)
	const runHistoryFile = useRunHistoryFile()
	return useCallback(
		async (workspace: Partial<Workspace>) => {
			const tables = getTables(outputTable)
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
			const files = [file, outputTable].filter(t => !!t) as FileWithPath[]
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
			const { exposure, outcome } = defineQuestion
			if (exposure?.label && outcome?.label) {
				const formatLabel = (label: string) => label.trim().replace(/\s/g, '_')
				copy.name = `ShowWhy_${formatLabel(exposure.label)}_causes_${formatLabel(outcome.label)}_${new Date().toISOString()}`
			}
			/* eslint-disable @essex/adjacent-await */
			await copy.add(files)
			await copy.toZip()
		},
		[
			fileCollection,
			defineQuestion,
			csvResult,
			getTables,
			outputTable,
			notebookResult,
			runHistoryFile,
		],
	)
}
