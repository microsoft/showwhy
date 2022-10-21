/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import { sleep } from '../utils/Sleep.js'
import type {
	DiscoverProgressCallback,
	DiscoverStartResponse,
	DiscoverStatusResponse,
} from './types.js'
import { DiscoverResponseStatus } from './types.js'

const RUN_CAUSAL_DISCOVERY_BASE_URL = process.env.DISCOVER_API_URL?.endsWith(
	'/',
)
	? process.env.DISCOVER_API_URL
	: `${process.env.DISCOVER_API_URL || '/api/discover'}/`

export async function fetchDiscoverResult(
	algorithmName: string,
	body: string,
	progressCallback?: DiscoverProgressCallback,
) {
	const taskId = await startDiscoverAndGetTaskId(algorithmName, body)

	let status = await fetchStatus(taskId)

	while (isProcessingStatus(status.status)) {
		await sleep(1000)
		status = await fetchStatus(taskId)
		progressCallback?.(status.progress ?? 0)
	}

	return status.result
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

async function fetchStatus(taskId: string): Promise<DiscoverStatusResponse> {
	return (await (
		await fetch(`${RUN_CAUSAL_DISCOVERY_BASE_URL}${taskId}`)
	).json()) as DiscoverStatusResponse
}

function isProcessingStatus(nodeStatus: DiscoverResponseStatus): boolean {
	const status = nodeStatus?.toLowerCase()
	return (
		status === DiscoverResponseStatus.Pending ||
		status === DiscoverResponseStatus.Started
	)
}
