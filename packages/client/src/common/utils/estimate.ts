/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { v4 } from 'uuid'
import { SESSION_ID_KEY } from './consts'
import { findRunError, returnPercentage } from './functions'
import { createAndReturnStorageItem } from './sessionStorage'
import { NodeResponseStatus, RefutationType } from '~enums'
import {
	EstimateEffectStatusResponse,
	RunHistory,
	RunStatus,
} from '~interfaces'

/**
 * It's the first to always run and to get the status depends only of itself
 */
export const returnEstimatorStatus = (
	response: Partial<EstimateEffectStatusResponse>,
): Partial<RunStatus> => {
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
	response: Partial<EstimateEffectStatusResponse>,
	isEstimatorCompleted: boolean,
): Partial<RunStatus> => {
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
	response: Partial<EstimateEffectStatusResponse>,
	isEstimatorCompleted: boolean,
	isConfidenceIntervalsCompleted: boolean,
	hasConfidenceInterval: boolean,
): Partial<RunStatus> => {
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
	return status.toLowerCase() === match
}

export function disableAllRuns(runHistory: RunHistory[]): RunHistory[] {
	return runHistory.map(run => {
		return { ...run, isActive: false }
	})
}

//TODO: simplify this function
export const returnStatus = (
	status: Partial<EstimateEffectStatusResponse>,
	hasConfidenceInterval: boolean,
	refutersLength: number,
): RunStatus => {
	const estimators = returnEstimatorStatus(status)
	const confidenceIntervals = returnConfidenceIntervalsStatus(
		status,
		matchStatus(
			estimators.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		),
	)
	const refuters = returnRefutersStatus(
		status,
		matchStatus(
			estimators.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		),
		matchStatus(
			confidenceIntervals.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		),
		hasConfidenceInterval,
	)

	let percentage = 100
	const totalResults = status?.total_results ?? 0
	const totalRefuters = returnRefutationCount(totalResults, refutersLength)

	status.total_results = totalResults
	status.estimated_effect_completed = status?.estimated_effect_completed ?? 0
	status.confidence_interval_completed =
		status?.confidence_interval_completed ?? 0
	status.refute_completed = status?.refute_completed ?? 0

	if (
		!matchStatus(
			estimators.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		)
	) {
		percentage = returnPercentage(
			status?.estimated_effect_completed,
			status?.total_results,
		)
	} else if (
		hasConfidenceInterval &&
		!matchStatus(
			confidenceIntervals.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		)
	) {
		percentage = returnPercentage(
			status?.confidence_interval_completed,
			status?.total_results,
		)
	} else if (
		!matchStatus(
			refuters.status as NodeResponseStatus,
			NodeResponseStatus.Completed,
		)
	) {
		percentage = returnPercentage(status?.refute_completed, totalRefuters)
	}

	const st = {
		status: status.runtimeStatus?.toLowerCase() as NodeResponseStatus,
		error: findRunError(status),
		percentage,
		estimators,
		confidenceIntervals,
		refuters,
	} as RunStatus

	if (totalResults) {
		st.estimated_effect_completed = `${status.estimated_effect_completed}/${status.total_results}`
		st.confidence_interval_completed = `${status.confidence_interval_completed}/${status.total_results}`
		st.refute_completed = `${status?.refute_completed}/${totalRefuters}`
	}
	return st
}

export function returnRefutationCount(
	estimatesCount: number,
	refutationLength: number,
): number {
	return estimatesCount * refutationLength
}

export function returnInitialRunHistory(
	specCount: number,
	totalRefuters: number,
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
			refute_completed: `0/${totalRefuters}`,
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
