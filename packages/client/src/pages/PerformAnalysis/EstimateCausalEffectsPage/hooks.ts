/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useBoolean } from '@fluentui/react-hooks'
import { useEffect, useState } from 'react'
import {
	useCancelOrchestrator,
	useEstimateNode,
	useIsDefaultRunProcessing,
	useRefutationOptions,
	useRunEstimate,
	useSetRunAsDefault,
	useWakeLock,
} from '~hooks'
import { numberExecutions } from '~resources'
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

export const useBusinessLogic = (): GenericObject => {
	const definitions = useDefineQuestion()
	const projectFiles = useProjectFiles()
	const estimators = useEstimators()
	const hasConfidenceInterval = useConfidenceInterval()
	const [
		loadingSpecCount,
		{ setTrue: trueLoadingSpecCount, setFalse: falseLoadingSpecCount },
	] = useBoolean(false)
	const [errors, setErrors] = useState<string>('')
	const runHistory = useRunHistory()
	const setRunAsDefault = useSetRunAsDefault()
	const cancelRun = useCancelOrchestrator()
	const specCount = useSpecCount()
	const setSpecCount = useSetSpecCount()
	const refutationOptions = useRefutationOptions()
	const runEstimate = useRunEstimate()
	const totalEstimatorsCount = estimators.length
	const estimateNode = useEstimateNode(projectFiles)
	const isProcessing = useIsDefaultRunProcessing()
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
	}
}
