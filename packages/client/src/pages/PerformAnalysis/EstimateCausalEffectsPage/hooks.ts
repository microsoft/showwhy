/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useEffect, useState } from 'react'
import { OrchestratorType } from '~enums'
import {
	useEstimateNode,
	useIsDefaultRunProcessing,
	useRefutationOptions,
	useRunEstimate,
	useSetRunAsDefault,
	useWakeLock,
} from '~hooks'
import { NodeRequest, ProjectFile } from '~interfaces'
import { buildLoadNode, numberExecutions, uploadFiles } from '~resources'
import {
	useConfidenceInterval,
	useDefineQuestion,
	useEstimators,
	useProjectFiles,
	useRunHistory,
	useSetSpecCount,
	useSpecCount,
} from '~state'
import { GenericObject } from '~types'
import { createFormData } from '~utils'

export const useBusinessLogic = (): GenericObject => {
	const definitions = useDefineQuestion()
	const projectFiles = useProjectFiles()
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
	const run = useRunEstimate()
	const estimateNode = useEstimateNode(projectFiles)
	const isProcessing = useIsDefaultRunProcessing()
	const totalEstimatorsCount = estimators.length
	useWakeLock()

	useEffect(() => {
		if (!estimateNode || isProcessing) return
		trueLoadingSpecCount()
		setErrors('')
		numberExecutions(estimateNode)
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

	const uploadProjectFiles = useCallback(
		async (projectFiles: ProjectFile[]) => {
			const filesData = createFormData(projectFiles)
			return await uploadFiles(filesData)
		},
		[],
	)

	const runEstimate = useCallback(async () => {
		setIsCanceled(false)
		const files = await uploadProjectFiles(projectFiles)
		const loadNode = buildLoadNode(
			files.uploaded_files[projectFiles[0].name],
			projectFiles[0].name,
		)
		const nodes = {
			nodes: [...loadNode.nodes, ...(estimateNode as NodeRequest).nodes],
		}
		await run().execute(nodes, OrchestratorType.Estimator)
	}, [run, estimateNode, projectFiles, specCount])

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
