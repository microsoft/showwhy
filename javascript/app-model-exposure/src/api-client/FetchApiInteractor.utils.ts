/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { api } from '../resources/api.js'
import type { NodeResponseStatus } from '../types/api/NodeResponseStatus.js'
import type { StatusResponse } from '../types/api/StatusResponse.js'
import type { ApiType } from './FetchApiInteractor.types.js'
import { isProcessingStatus, wait } from './utils.js'

export async function checkStatus(
	taskId: string,
	type: ApiType,
	updateFn?: (taskId: string, status: StatusResponse) => void,
	_updateId?: string,
): Promise<StatusResponse> {
	let status = await api.fetchStatus<StatusResponse>(taskId, type)

	while (isProcessingStatus(status.status as NodeResponseStatus)) {
		// eslint-disable-next-line @essex/adjacent-await
		await wait(3000)
		// eslint-disable-next-line @essex/adjacent-await
		status = await api.fetchStatus<StatusResponse>(taskId, type)
		updateFn?.(_updateId ?? taskId, status)
	}
	updateFn?.(_updateId ?? taskId, status)
	return status
}
