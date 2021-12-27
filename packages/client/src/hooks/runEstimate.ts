/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState, useEffect } from 'react'
import { NodeResponseStatus } from '~enums'
import { useDefaultRun, useEstimateNode, useRefutationLength } from '~hooks'
import { CheckStatus, NodeRequest, NodeResponse } from '~interfaces'
import { Estimate } from '~classes'
import {
	useConfidenceInterval,
	useProjectFiles,
	useRefutationType,
	useRunHistory,
	useSpecCount,
	useUpdateActiveRunHistory,
	useUpdateRunHistory,
} from '~state'
import {
	isStatusProcessing,
	returnInitialRunHistory,
	returnRefutationCount,
	returnStatus,
} from '~utils'

export const useRunEstimate = (): any => {
	const projectFiles = useProjectFiles()
	const updateRunHistory = useUpdateRunHistory()
	const updateActive = useUpdateActiveRunHistory()
	const estimateNode = useEstimateNode(projectFiles)
	const specCount = useSpecCount()
	const [run, setRun] = useState<Estimate>()
	const [isCanceled, setIsCanceled] = useState<boolean>(false)

	const refutationType = useRefutationType()
	const hasConfidenceInterval = useConfidenceInterval()
	const getRefutationCount = useRefutationLength()
	const runHistory = useRunHistory()
	const totalRefuters = useRefutationLength()
	const defaultRun = useDefaultRun()

	useEffect(() => {
		if (
			!run &&
			defaultRun &&
			isStatusProcessing(defaultRun?.status?.status as NodeResponseStatus)
		) {
			const newRun = new Estimate(onStart, onUpdate, onComplete)
			newRun.setOrchestratorResponse(defaultRun.nodeResponse)
			setRun(newRun)
		}
	}, [defaultRun, run, setRun])

	const totalRefutation = useMemo((): any => {
		return returnRefutationCount(specCount as number, totalRefuters)
	}, [specCount, totalRefuters])

	const onUpdate = useCallback(
		(status: CheckStatus) => {
			const updatedStatus = returnStatus(
				status,
				hasConfidenceInterval,
				totalRefutation,
				specCount as number,
			)

			updateActive(updatedStatus, status?.partial_results)
		},
		[
			updateRunHistory,
			getRefutationCount,
			hasConfidenceInterval,
			runHistory,
			specCount,
			totalRefutation,
		],
	)

	const onComplete = useCallback(
		(status: CheckStatus) => {
			//Update end time
			// const updatedStatus = {
			// 	start
			// }
			// updateActive(updatedStatus, status?.partial_results)
		},
		[
			updateRunHistory,
			getRefutationCount,
			hasConfidenceInterval,
			runHistory,
			specCount,
			totalRefutation,
		],
	)

	const onStart = useCallback(
		(nodeResponse: NodeResponse) => {
			const initialRun = returnInitialRunHistory(
				specCount as number,
				totalRefutation,
				hasConfidenceInterval,
				refutationType,
				runHistory.length,
				nodeResponse,
			)
			updateRunHistory(initialRun)
		},
		[
			updateRunHistory,
			hasConfidenceInterval,
			refutationType,
			specCount,
			totalRefuters,
			runHistory,
			totalRefutation,
		],
	)

	const runEstimate = useCallback(async () => {
		const newRun = new Estimate(onStart, onUpdate, onComplete)
		setRun(newRun)

		await newRun.uploadFiles(projectFiles)
		await newRun.execute(estimateNode as NodeRequest)
	}, [updateRunHistory, runHistory, specCount, run])

	const cancelRun = useCallback(() => {
		setIsCanceled(true)
		run && run.cancel()
	}, [run, setIsCanceled])

	return { runEstimate, cancelRun, isCanceled }
}
