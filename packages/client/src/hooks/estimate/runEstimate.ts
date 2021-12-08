/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useCallback, useEffect, useState } from 'react'
import { useSendData } from './send'
import { useCheckRunStatus, useStartProcess } from './start'
import { useEstimateNode, useIsProcessing } from './variables'
import {
	useGetReady,
	useRefutationOptions,
	useSetRunAsDefault,
	useWakeLock,
} from '~hooks'
import { numberExecutions, terminateRun } from '~resources'
import {
	useConfidenceInterval,
	useDefineQuestion,
	useEstimators,
	useNodeResponse,
	useProjectFiles,
	useRefutationType,
	useRunHistory,
	useSetNodeResponse,
	useSetRunHistory,
	useSetSpecCount,
	useSpecCount,
} from '~state'
import { GenericObject } from '~types'

export const useRunEstimate = (): GenericObject => {
	const definitions = useDefineQuestion()
	const projectFiles = useProjectFiles()
	const estimators = useEstimators()
	const hasConfidenceInterval = useConfidenceInterval()
	const [
		loadingSpecCount,
		{ setTrue: trueLoadingSpecCount, setFalse: falseLoadingSpecCount },
	] = useBoolean(false)
	const [canceled, setCanceled] = useState<boolean | undefined>(false)
	const refutationType = useRefutationType()
	const [errors, setErrors] = useState<string>('')
	const setRunHistory = useSetRunHistory()
	const runHistory = useRunHistory()
	const setRunAsDefault = useSetRunAsDefault()
	const getReady = useGetReady()
	const setNodeResponse = useSetNodeResponse()
	const nodeResponse = useNodeResponse()
	const checkRunStatus = useCheckRunStatus(getReady)
	const specCount = useSpecCount()
	const setSpecCount = useSetSpecCountState()
	const isProcessing = useIsProcessing(runHistory)
	const confidenceInterval = useConfidenceInterval()
	const refutationOptions = useRefutationOptions()
	const totalEstimatorsCount = estimators.length
	useWakeLock()
	const estimateNode = useEstimateNode(projectFiles)

	useEffect(() => {
		if (!estimateNode || (!!specCount && isProcessing)) return
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
		specCount,
		isProcessing,
		setSpecCount,
		estimateNode,
		setErrors,
		falseLoadingSpecCount,
		trueLoadingSpecCount,
	])

	const startProcess = useStartProcess(
		setRunHistory,
		setRunAsDefault,
		getReady,
		refutationType,
		specCount,
	)

	const sendData = useSendData({
		projectFiles,
		estimateNode,
		startProcess,
		setCanceled,
		setNodeResponse,
		initialStatus: {
			runHistory,
			specCount,
			setRunHistory,
			setRunAsDefault,
			refutationType: refutationType,
		},
		confidenceInterval,
	})

	const cancelRun = useCallback(() => {
		nodeResponse && terminateRun(nodeResponse.terminatePostUri)
		setNodeResponse(undefined)
		setCanceled(true)
	}, [nodeResponse, setNodeResponse, setCanceled])

	return {
		isProcessing,
		totalEstimatorsCount,
		specCount,
		canceled,
		estimators,
		definitions,
		runHistory,
		errors,
		cancelRun,
		sendData,
		setRunAsDefault,
		loadingSpecCount,
		checkRunStatus,
		hasConfidenceInterval,
		refutationOptions,
	}
}

const useSetSpecCountState = () => {
	const set = useSetSpecCount()
	return useCallback(
		(count?: number) => {
			set(count)
		},
		[set],
	)
}
