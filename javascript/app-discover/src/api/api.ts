/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import {
	CancelablePromise,
	CanceledPromiseError,
} from '../utils/CancelablePromise.js'
import { sleep } from '../utils/Sleep.js'
import type {
	DiscoverProgressCallback,
	DiscoverStartResponse,
	DiscoverStatusResponse,
	FetchDiscoverMetadata,
	FetchDiscoverResult,
	FetchDiscoverResultPromise,
} from './types.js'
import { DiscoverResponseStatus } from './types.js'

const RUN_CAUSAL_DISCOVERY_BASE_URL = getCausalDiscoveryBaseUrl()

function getCausalDiscoveryBaseUrl(): string {
	let base = process.env.DISCOVER_API_URL || '/api/discover/'

	if (!base.endsWith('/')) {
		base += '/'
	}
	return base
}

async function _fetchDiscoverResult<T>(
	cancelablePromise: FetchDiscoverResultPromise<T>,
	algorithmName: string,
	body: string,
	progressCallback?: DiscoverProgressCallback,
) {
	const taskId = await startDiscoverAndGetTaskId(algorithmName, body)

	cancelablePromise.metadata = { taskId }

	let status = await fetchStatus<T>(taskId)

	let last_progress = 0.0

	progressCallback?.(last_progress, taskId)

	// TODO: replace this pooling with something like web sockets
	while (
		isProcessingStatus(status.status) &&
		!cancelablePromise.isCancellingOrCanceled()
	) {
		await sleep(1000)

		status = await fetchStatus<T>(taskId)
		last_progress = Math.max(status.progress ?? 0, last_progress)

		if (!cancelablePromise.isCancellingOrCanceled()) {
			progressCallback?.(last_progress, taskId)
		}
	}

	if (
		cancelablePromise.isCancellingOrCanceled() ||
		isRevokedStatus(status.status)
	) {
		cancelablePromise.setCanceled()
		throw new CanceledPromiseError(`task ${taskId} has been canceled`)
	}

	if (isFailureStatus(status.status)) {
		throw new Error(`error running discovery: ${status.result as string}`)
	}

	cancelablePromise.setFinished()

	return { result: status.result, taskId: taskId }
}

export function fetchDiscoverResult<T>(
	algorithmName: string,
	body: string,
	progressCallback?: DiscoverProgressCallback,
): FetchDiscoverResultPromise<T> {
	const cancelablePromise = new CancelablePromise<
		FetchDiscoverMetadata,
		FetchDiscoverResult<T>
	>({ taskId: undefined })

	cancelablePromise.promise = new Promise((resolve, reject) => {
		try {
			resolve(
				_fetchDiscoverResult(
					cancelablePromise,
					algorithmName,
					body,
					progressCallback,
				),
			)
		} catch (err) {
			reject(err)
		}
	})

	cancelablePromise.cancel = async () => {
		if (cancelablePromise.isFinished()) {
			return
		}

		cancelablePromise.setCanceling()

		if (cancelablePromise.metadata?.taskId) {
			await cancelDiscoverTask(cancelablePromise.metadata?.taskId)
		}
	}

	return cancelablePromise
}

export async function cancelDiscoverTask(taskId: string) {
	await fetch(`${RUN_CAUSAL_DISCOVERY_BASE_URL}${taskId}`, {
		method: 'DELETE',
	})
}

async function startDiscoverAndGetTaskId(
	algorithmName: string,
	body: string,
): Promise<string> {
	const startResult = await fetch(
		`${RUN_CAUSAL_DISCOVERY_BASE_URL}${algorithmName.toLowerCase()}`,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body,
		},
	)
	return ((await startResult.json()) as DiscoverStartResponse).id
}

async function fetchStatus<T>(
	taskId: string,
): Promise<DiscoverStatusResponse<T>> {
	return (await (
		await fetch(`${RUN_CAUSAL_DISCOVERY_BASE_URL}${taskId}`)
	).json()) as DiscoverStatusResponse<T>
}

function isProcessingStatus(nodeStatus: DiscoverResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return (
		status === DiscoverResponseStatus.Pending ||
		status === DiscoverResponseStatus.Started
	)
}

function isRevokedStatus(nodeStatus: DiscoverResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return status === DiscoverResponseStatus.Revoked
}

function isFailureStatus(nodeStatus: DiscoverResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return status === DiscoverResponseStatus.Failure
}
