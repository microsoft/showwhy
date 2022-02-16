/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { v4 } from 'uuid'
import { SESSION_ID_KEY } from './consts'
import { createAndReturnStorageItem } from './sessionStorage'
import { RunHistory, NodeResponseStatus, RefutationType, Maybe } from '~types'

export function initialRunHistory(
	specCount: number,
	hasConfidenceInterval: boolean,
	refutationType: RefutationType,
	runHistoryLength: number,
): RunHistory {
	return {
		id: v4(),
		runNumber: runHistoryLength + 1,
		isActive: true,
		status: {
			status: NodeResponseStatus.Running,
			estimated_effect_completed: `0/${specCount}`,
			confidence_interval_completed: `0/${specCount}`,
			refute_completed: `0/${specCount}`,
			percentage: 0,
			time: {
				start: new Date(),
			},
		},
		sessionId: createAndReturnStorageItem(SESSION_ID_KEY, v4()),
		hasConfidenceInterval,
		refutationType,
	} as RunHistory
}

export function isProcessingStatus(nodeStatus: NodeResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return (
		status === NodeResponseStatus.Processing ||
		status === NodeResponseStatus.InProgress ||
		status === NodeResponseStatus.Pending ||
		status === NodeResponseStatus.Running
	)
}

export function isStatus(
	status: Maybe<NodeResponseStatus>,
	match: NodeResponseStatus,
): boolean {
	return (status && status.toLowerCase() === match) ?? false
}

export function disableAllRuns(runHistory: RunHistory[]): RunHistory[] {
	return runHistory.map(run => {
		return { ...run, isActive: false }
	})
}
