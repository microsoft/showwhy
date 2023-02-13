/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { api } from '../resources/api.js'
import { setStorageItem } from '../state/sessionStorage.js'
import { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { StatusResponse } from '../types/api/StatusResponse.js'
import type { ApiType } from './FetchApiInteractor.types.js'
import { isProcessingStatus, wait } from './utils.js'

export async function checkStatus({
	taskId,
	type,
	updateFn,
	_updateId,
	signal,
}: {
	taskId: string
	type: ApiType
	updateFn?: (taskId: string, status: StatusResponse) => void
	_updateId?: string
	signal?: AbortSignal
}): Promise<StatusResponse> {
	let status = await getStatusDelay(taskId, type, signal, _updateId)

	while (
		isProcessingStatus(status.status as NodeResponseStatus) &&
		window.location.pathname.includes('analyze')
	) {
		status = await getStatusDelay(
			taskId,
			type,
			signal,
			_updateId,
			updateFn,
			10000,
		)
	}
	updateFn?.(_updateId ?? taskId, status)
	saveToSessionStorage(taskId, type, _updateId, status)
	return status
}

function saveToSessionStorage(
	taskId: string,
	type: ApiType,
	_updateId?: string,
	response?: StatusResponse,
) {
	if (!window.location.pathname.includes('analyze')) {
		setStorageItem(
			'lastRun',
			JSON.stringify({ taskId, _updateId, type, response }),
		)
	}
}

async function getStatusDelay(
	taskId: string,
	type: ApiType,
	signal?: AbortSignal,
	_updateId?: string,
	updateFn?: (taskId: string, status: StatusResponse) => void,
	ms = 0,
) {
	let status
	try {
		// eslint-disable-next-line @essex/adjacent-await
		await wait(ms)
		// eslint-disable-next-line @essex/adjacent-await
		status = await api.fetchStatus<StatusResponse>(taskId, type, signal)
		saveToSessionStorage(taskId, type, _updateId, status)
		updateFn?.(_updateId ?? taskId, status)
		return status
	} catch {
		return {
			status: NodeResponseStatus.Error,
			completed: 0,
			pending: 0,
			failed: 0,
		}
	}
}
