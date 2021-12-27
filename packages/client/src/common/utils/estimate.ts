/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { v4 } from 'uuid'
import { NodeResponseStatus } from '~enums'
import { CheckStatus, NodeResponse, RunHistory, RunStatus } from '~interfaces'
import { findRunError, returnPercentage } from '~utils'

/**
 * It's the first to always run and to get the status depends only of itself
 */
export const returnEstimatorStatus = (response: Partial<CheckStatus>) => {
	return {
		status:
			!!response?.estimated_effect_completed &&
			response?.estimated_effect_completed === response?.total_results
				? NodeResponseStatus.Completed
				: NodeResponseStatus.Running,
	}
}
/**
 * If enabled, runs after estimators
 * So to get the status, it depends on the status of it
 */
export const returnConfidenceIntervalsStatus = (
	response: Partial<CheckStatus>,
	isEstimatorCompleted: boolean,
) => {
	return {
		status:
			!!response?.confidence_interval_completed &&
			response?.confidence_interval_completed === response?.total_results
				? NodeResponseStatus.Completed
				: isEstimatorCompleted
				? NodeResponseStatus.Running
				: NodeResponseStatus.Idle,
	}
}
/**
 * Runs after estimators and confidence intervals (if enabled)
 * So to get the status, it depends on the status of these other 2
 */
export const returnRefutersStatus = (
	response: Partial<CheckStatus>,
	isEstimatorCompleted: boolean,
	isConfidenceIntervalsCompleted: boolean,
	hasConfidenceInterval: boolean,
) => {
	return {
		status:
			!!response?.refute_completed &&
			response?.refute_completed === response?.total_results
				? NodeResponseStatus.Completed
				: (
						hasConfidenceInterval
							? isConfidenceIntervalsCompleted
							: isEstimatorCompleted
				  )
				? NodeResponseStatus.Running
				: NodeResponseStatus.Idle,
	}
}

export const isStatusProcessing = (nodeStatus: NodeResponseStatus): boolean => {
	const status = nodeStatus?.toLowerCase()
	return (
		status === NodeResponseStatus.Processing ||
		status === NodeResponseStatus.InProgress ||
		status === NodeResponseStatus.Pending ||
		status === NodeResponseStatus.Running
	)
}

export const matchStatus = (
	status: NodeResponseStatus,
	match: NodeResponseStatus,
): boolean => {
	return status === match
}

export function disableAllRuns(runHistory: RunHistory[]): RunHistory[] {
	return runHistory.map(run => {
		return { ...run, isActive: false }
	})
}

//TODO: simplify this function
export const returnStatus = (
	status: Partial<CheckStatus>,
	hasConfidenceInterval: boolean,
	totalRefuters: number,
	specCount: number,
): RunStatus => {
	const estimators = returnEstimatorStatus(status)
	const confidenceIntervals = returnConfidenceIntervalsStatus(
		status,
		matchStatus(estimators.status, NodeResponseStatus.Completed),
	)
	const refuters = returnRefutersStatus(
		status,
		matchStatus(estimators.status, NodeResponseStatus.Completed),
		matchStatus(confidenceIntervals.status, NodeResponseStatus.Completed),
		hasConfidenceInterval,
	)

	let percentage = 100

	status.total_results = status?.total_results ?? 1
	status.estimated_effect_completed = status?.estimated_effect_completed ?? 0
	status.confidence_interval_completed =
		status?.confidence_interval_completed ?? 0
	status.refute_completed = status?.refute_completed ?? 0

	if (!matchStatus(estimators.status, NodeResponseStatus.Completed)) {
		percentage = returnPercentage(
			status?.estimated_effect_completed,
			status?.total_results,
		)
	} else if (
		hasConfidenceInterval &&
		!matchStatus(confidenceIntervals.status, NodeResponseStatus.Completed)
	) {
		percentage = returnPercentage(
			status?.confidence_interval_completed,
			status?.total_results,
		)
	} else if (!matchStatus(refuters.status, NodeResponseStatus.Completed)) {
		percentage = returnPercentage(status?.refute_completed, totalRefuters)
	}

	return {
		status: status.runtimeStatus?.toLowerCase() as NodeResponseStatus,
		error: findRunError(status),
		estimated_effect_completed: `${status.estimated_effect_completed}/${specCount}`,
		confidence_interval_completed: `${status.confidence_interval_completed}/${specCount}`,
		refute_completed: `${status?.refute_completed}/${totalRefuters}`,
		percentage,
		estimators,
		confidenceIntervals,
		refuters,
	} as RunStatus
}

export function returnRefutationCount(
	estimatesCount: number,
	refutationLength: number,
): number {
	return estimatesCount * refutationLength
}

export function returnInitialRunHistory(
	specCount,
	totalRefuters,
	hasConfidenceInterval,
	refutationType,
	runHistoryLength,
	nodeResponse: NodeResponse,
): RunHistory {
	return {
		id: v4(),
		runNumber: runHistoryLength + 1,
		isActive: true,
		status: {
			status: NodeResponseStatus.Running,
			estimated_effect_completed: `0/${specCount}`,
			confidence_interval_completed: `0/${specCount}`,
			refute_completed: `0/${totalRefuters}`,
			percentage: 0,
			time: {
				start: new Date(),
			},
		},
		nodeResponse,
		hasConfidenceInterval,
		refutationType,
	} as RunHistory
}
