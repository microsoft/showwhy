/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sleep } from '../utils/Sleep.js'
import type {
	DiscoverProgressCallback,
	DiscoverResult,
	DiscoverStartResponse,
	DiscoverStatusResponse,
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

export async function fetchDiscoverResult<T>(
	algorithmName: string,
	body: string,
	progressCallback?: DiscoverProgressCallback,
): Promise<DiscoverResult<T>> {
	const taskId = await startDiscoverAndGetTaskId(algorithmName, body)

	let status = await fetchStatus<T>(taskId)

	progressCallback?.(0, taskId)

	// TODO: replace this pooling with something like web sockets
	while (isProcessingStatus(status.status)) {
		await sleep(1000)
		status = await fetchStatus<T>(taskId)
		progressCallback?.(status.progress ?? 0, taskId)
	}

	return { result: status.result, taskId: taskId }
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
