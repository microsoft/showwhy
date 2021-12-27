/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback, useMemo, useState, useEffect } from 'react'
import { NodeResponseStatus } from '~enums'
import { useDefaultRun, useEstimateNode, useRefutationLength } from '~hooks'
import { CheckStatus, NodeRequest, NodeResponse } from '~interfaces'
import { Run } from '~resources/run'
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
	const [run, setRun] = useState<Run>()
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
			const newRun = new Run(onStart, onUpdate, undefined, onCancel)
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

	const onCancel = useCallback(() => {
		setIsCanceled(true)
	}, [setIsCanceled])

	const runEstimate = useCallback(async () => {
		const newRun = new Run(onStart, onUpdate, undefined, onCancel)
		setRun(newRun)

		await newRun.uploadFiles(projectFiles)
		await newRun.execute(estimateNode as NodeRequest)
	}, [updateRunHistory, runHistory, specCount, run])

	const cancelRun = useCallback(() => {
		run && run.cancel()
	}, [run])

	return { runEstimate, cancelRun, isCanceled }
}
