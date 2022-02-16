/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { percentage } from './stats'
import {
	EstimateEffectStatusResponse,
	RunStatus,
	NodeResponseStatus,
	Maybe,
} from '~types'
import { isStatus } from './api'

//TODO: simplify this function
export function getRunStatus(
	status: Partial<EstimateEffectStatusResponse>,
	hasConfidenceInterval: boolean,
	refutersLength: number,
): RunStatus {
	const estimators = getEstimatorStatus(status)
	const confidenceIntervals = getConfidenceIntervalStatus(
		status,
		isStatus(estimators.status, NodeResponseStatus.Completed),
	)
	const refuters = getRefutationStatus(
		status,
		isStatus(estimators.status, NodeResponseStatus.Completed),
		isStatus(confidenceIntervals.status, NodeResponseStatus.Completed),
		hasConfidenceInterval,
	)

	let pct = 100
	const totalResults = status?.total_results ?? 0
	const refuteCompleted = getRefutationCount(
		status?.refute_completed ?? 0,
		refutersLength,
	)

	status.total_results = totalResults
	status.estimated_effect_completed = status?.estimated_effect_completed ?? 0
	status.confidence_interval_completed =
		status?.confidence_interval_completed ?? 0
	status.refute_completed = refuteCompleted

	if (!isStatus(estimators.status, NodeResponseStatus.Completed)) {
		pct = percentage(status?.estimated_effect_completed, status?.total_results)
	} else if (
		hasConfidenceInterval &&
		!isStatus(confidenceIntervals.status, NodeResponseStatus.Completed)
	) {
		pct = percentage(
			status?.confidence_interval_completed,
			status?.total_results,
		)
	} else if (!isStatus(refuters.status, NodeResponseStatus.Completed)) {
		pct = percentage(status?.refute_completed, totalResults)
	}

	const st = {
		status: status.runtimeStatus?.toLowerCase() as NodeResponseStatus,
		error: findRunError(status),
		percentage: pct,
		estimators,
		confidenceIntervals,
		refuters,
	} as RunStatus

	if (totalResults) {
		st.estimated_effect_completed = `${status.estimated_effect_completed}/${status.total_results}`
		st.confidence_interval_completed = `${status.confidence_interval_completed}/${status.total_results}`
		st.refute_completed = `${status?.refute_completed}/${totalResults}`
	}
	return st
}

function getRefutationCount(
	refutationCount: number,
	refutationLength: number,
): number {
	return Math.floor(refutationCount / refutationLength)
}
function findRunError(
	response: Partial<EstimateEffectStatusResponse>,
): Maybe<string> {
	if (response.runtimeStatus?.toLowerCase() === NodeResponseStatus.Failed) {
		const error =
			response.partial_results &&
			response.partial_results.find(r => r.state === NodeResponseStatus.Failed)
		const errorMessage = !!error
			? error?.traceback || error?.error
			: (response?.output as string) ||
			  'Undefined error. Please, execute the run again.'
		console.log('Traceback:', errorMessage)
		return errorMessage
	}
	return undefined
}

/**
 * It's the first to always run and to get the status depends only of itself
 */
function getEstimatorStatus(
	response: Partial<EstimateEffectStatusResponse>,
): Partial<RunStatus> {
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
function getConfidenceIntervalStatus(
	response: Partial<EstimateEffectStatusResponse>,
	isEstimatorCompleted: boolean,
): Partial<RunStatus> {
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
function getRefutationStatus(
	response: Partial<EstimateEffectStatusResponse>,
	isEstimatorCompleted: boolean,
	isConfidenceIntervalsCompleted: boolean,
	hasConfidenceInterval: boolean,
): Partial<RunStatus> {
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
