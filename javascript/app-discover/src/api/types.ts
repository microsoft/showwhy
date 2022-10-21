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

export interface DiscoverStartResponse {
	id: string
}

export interface DiscoverStatusResponse {
	status: DiscoverResponseStatus
	progress?: number
	result: unknown
}

export type DiscoverProgressCallback = (progress: number) => void
