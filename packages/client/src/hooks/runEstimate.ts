/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState } from 'react'
import { Estimate } from '~classes'
import { useEstimateNode, useRefutationLength } from '~hooks'
import {
	EstimateEffectStatusResponse,
	NodeRequest,
	NodeResponse,
	RunStatus,
} from '~interfaces'
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
	const [isCanceled, setIsCanceled] = useState<boolean>(false)

	const refutationType = useRefutationType()
	const hasConfidenceInterval = useConfidenceInterval()
	const getRefutationCount = useRefutationLength()
	const runHistory = useRunHistory()
	const totalRefuters = useRefutationLength()

	const totalRefutation = useMemo((): any => {
		return returnRefutationCount(specCount as number, totalRefuters)
	}, [specCount, totalRefuters])

	const onUpdate = useCallback(
		(status: EstimateEffectStatusResponse) => {
			const updatedStatus = returnStatus(
				status,
				hasConfidenceInterval,
				totalRefutation,
				specCount as number,
			)

			updateActive(updatedStatus, status?.partial_results)
		},
		[
			updateActive,
			updateRunHistory,
			hasConfidenceInterval,
			specCount,
			totalRefutation,
		],
	)

	const onComplete = useCallback(() => {
		const updatedStatus = {
			time: {
				end: new Date(),
			},
		} as RunStatus
		updateActive(updatedStatus)
	}, [updateActive])

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
			runHistory,
			totalRefutation,
		],
	)

	const cancelRun = useCallback(() => {
		const estimate = new Estimate(onStart, onUpdate, onComplete)

		setIsCanceled(true)
		estimate.cancel()
	}, [setIsCanceled, onStart, onUpdate, onComplete])

	const runEstimate = useCallback(async () => {
		const estimate = new Estimate(onStart, onUpdate, onComplete)

		setIsCanceled(false)
		await estimate.uploadFiles(projectFiles)
		await estimate.execute(estimateNode as NodeRequest)
	}, [setIsCanceled, estimateNode, onComplete, onStart, onUpdate, projectFiles])

	return { runEstimate, cancelRun, isCanceled }
}
