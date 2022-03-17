/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { OrchestratorType } from '@showwhy/api-client'
import { buildLoadNode } from '@showwhy/builders'
import type {
	AsyncHandler,
	Estimator,
	Experiment,
	Handler,
	Maybe,
	NodeRequest,
	RefutationOption,
} from '@showwhy/types'
import type ColumnTable from 'arquero/dist/types/table/column-table'
import { useCallback, useEffect, useState } from 'react'

import {
	useAllColumns,
	useEstimateNode,
	useIsDefaultRunProcessing,
	useRefutationOptions,
	useRunEstimate,
	useSetRunAsDefault,
	useUpdateAndDisableRunHistory,
	useWakeLock,
} from '~hooks'
import { api } from '~resources'
import {
	useCausalFactors,
	useConfidenceInterval,
	useEstimators,
	useExperiment,
	useOutputTablePrep,
	useProjectFiles,
	useRefutationType,
	useRunHistory,
	useSetSpecCount,
	useSpecCount,
} from '~state'
import type { RunHistory } from '~types'
import { createFormData, initialRunHistory } from '~utils'

const OUTPUT_FILE_NAME = 'output'

export function useBusinessLogic(): {
	isProcessing: boolean
	totalEstimatorsCount: number
	specCount: Maybe<number>
	estimators: Estimator[]
	definitions: Experiment
	runHistory: RunHistory[]
	errors: Maybe<string>
	cancelRun: Handler
	runEstimate: AsyncHandler
	setRunAsDefault: (run: RunHistory) => void
	loadingSpecCount: boolean
	hasConfidenceInterval: boolean
	refutationOptions: RefutationOption[]
	isCanceled: boolean
} {
	const definitions = useExperiment()
	const updateRunHistory = useUpdateAndDisableRunHistory()
	const projectFiles = useProjectFiles()
	const outputTablePrep = useOutputTablePrep()
	const estimators = useEstimators()
	const hasConfidenceInterval = useConfidenceInterval()
	const [
		loadingSpecCount,
		{ setTrue: trueLoadingSpecCount, setFalse: falseLoadingSpecCount },
	] = useBoolean(false)
	const [isCanceled, setIsCanceled] = useState<boolean>(false)
	const [errors, setErrors] = useState<string>('')
	const runHistory = useRunHistory()
	const setRunAsDefault = useSetRunAsDefault()
	const specCount = useSpecCount()
	const setSpecCount = useSetSpecCount()
	const refutationOptions = useRefutationOptions()
	const refutationType = useRefutationType()
	const run = useRunEstimate()
	const estimateNode = useEstimateNode(OUTPUT_FILE_NAME)
	const isProcessing = useIsDefaultRunProcessing()
	const totalEstimatorsCount = estimators.length
	const causalFactors = useCausalFactors()
	const allColumns = useAllColumns(causalFactors, definitions)
	useWakeLock()

	useEffect(() => {
		if (!estimateNode || isProcessing) return
		trueLoadingSpecCount()
		setErrors('')
		api
			.numberExecutions(estimateNode)
			.then(res => {
				setSpecCount(res.total_executions)
			})
			.catch(err => {
				setErrors(
					err.message || 'Unknown error, please contact the system admin.',
				)
			})
			.finally(() => falseLoadingSpecCount())
	}, [
		isProcessing,
		setSpecCount,
		estimateNode,
		setErrors,
		falseLoadingSpecCount,
		trueLoadingSpecCount,
	])

	const uploadOutputFile = useCallback(async (file: ColumnTable) => {
		const filesData = createFormData(file, OUTPUT_FILE_NAME)
		return api.uploadFiles(filesData)
	}, [])

	const saveNewRunHistory = useCallback(() => {
		const initialRun = initialRunHistory(
			specCount as number,
			hasConfidenceInterval,
			refutationType,
			runHistory.length,
		)
		updateRunHistory(initialRun)
	}, [
		updateRunHistory,
		specCount,
		hasConfidenceInterval,
		refutationType,
		runHistory.length,
	])

	const runEstimate = useCallback(async () => {
		setIsCanceled(false)
		saveNewRunHistory()
		const output = outputTablePrep?.select(allColumns) as ColumnTable
		const files = await uploadOutputFile(output)
		const loadNode = buildLoadNode(
			files.uploaded_files[OUTPUT_FILE_NAME]!,
			OUTPUT_FILE_NAME,
		)
		const nodes = {
			nodes: [...loadNode.nodes, ...(estimateNode as NodeRequest).nodes],
		}
		await run().execute(nodes, OrchestratorType.Estimator)
	}, [
		run,
		estimateNode,
		projectFiles,
		setIsCanceled,
		saveNewRunHistory,
		uploadOutputFile,
		outputTablePrep,
		allColumns,
	])

	const cancelRun = useCallback(() => {
		setIsCanceled(true)
		run().cancel()
	}, [setIsCanceled, run])

	return {
		isProcessing,
		totalEstimatorsCount,
		specCount,
		estimators,
		definitions,
		runHistory,
		errors,
		cancelRun,
		runEstimate,
		setRunAsDefault,
		loadingSpecCount,
		hasConfidenceInterval,
		refutationOptions,
		isCanceled,
	}
}
