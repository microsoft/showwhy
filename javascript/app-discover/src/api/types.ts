/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { InterventionByColumn } from '../domain/CausalInference.js'
import type { CancelablePromise } from '../utils/CancelablePromise.js'

export enum DiscoverResponseStatus {
	Pending = 'pending',
	Started = 'started',
	Success = 'success',
	Failure = 'failure',
	Retry = 'retry',
	Revoked = 'revoked',
}

export interface FetchDiscoverResult<T> {
	result: T
}

export interface DiscoverStartResponse {
	id: string
}

export interface DiscoverStatusResponse<T> {
	status: DiscoverResponseStatus
	progress?: number
	result: T
}

export interface FetchDiscoverMetadata {
	taskId?: string
}

export type DiscoverProgressCallback = (
	progress: number,
	taskId: string,
) => void

export type FetchDiscoverResultPromise<T> = CancelablePromise<
	FetchDiscoverMetadata,
	FetchDiscoverResult<T>
>

export interface InterventionResponse {
	baseline: InterventionByColumn
	intervention: InterventionByColumn
}
