/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { useCallback } from 'react'
import {
	useDefaultRun,
	useEstimateNode,
	useRefutationCount,
	useReturnNewRunHistory,
} from '~hooks'
import { CheckStatus, NodeRequest, RunHistory } from '~interfaces'
import { Run } from '~resources/run'
import {
	useConfidenceInterval,
	useProjectFiles,
	useRefutationType,
	useUpdateRunHistory,
} from '~state'
import { GenericFn } from '~types'
import { returnEstimateStatus } from '~utils'

export const useRunEstimate = (): GenericFn => {
	const projectFiles = useProjectFiles()
	const updateRunHistory = useUpdateRunHistory()
	const estimateNode = useEstimateNode(projectFiles)

	const newRun = useReturnNewRunHistory()
	const refutationType = useRefutationType()
	const hasConfidenceInterval = useConfidenceInterval()
	const getRefutationCount = useRefutationCount()
	//updateStatus should be able to get directly from here, shouldn't it?
	const defaultRun = useDefaultRun()

	const updateStatus = useCallback(
		(status: CheckStatus, run: RunHistory) => {
			const updatedStatus = returnEstimateStatus(
				status,
				getRefutationCount,
				run,
			)
			updateRunHistory(updatedStatus)
		},
		[updateRunHistory, getRefutationCount],
	)

	return useCallback(async () => {
		const initialRun = newRun(hasConfidenceInterval, refutationType)
		//This stores this run as deault
		updateRunHistory(initialRun)

		//If I try to pass the function without the initialRun here, and let the updateStatus callback
		//get the defaultRun value, it's undefined everytime
		const run = new Run(status => updateStatus(status, initialRun))
		await run.uploadFiles(projectFiles)
		await run.startExecution(estimateNode as NodeRequest)
	}, [updateRunHistory, updateStatus])
}
