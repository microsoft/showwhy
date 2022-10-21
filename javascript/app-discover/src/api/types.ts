/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
export enum DiscoverResponseStatus {
	Pending = 'pending',
	Started = 'started',
	Success = 'success',
	Failure = 'failure',
	Retry = 'retry',
	Revoked = 'revoked',
}

export interface DiscoverResult<T> {
	result: T
	taskId: string
}

export interface DiscoverStartResponse {
	id: string
}

export interface DiscoverStatusResponse<T> {
	status: DiscoverResponseStatus
	progress?: number
	result: T
}

export type DiscoverProgressCallback = (
	progress: number,
	taskId: string,
) => void
