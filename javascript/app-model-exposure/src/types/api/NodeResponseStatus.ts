/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

/* Based on celery status */
export enum NodeResponseStatus {
	Pending = 'pending',
	Started = 'started',
	Success = 'success',
	Failure = 'failure',
	Retry = 'retry',
	Revoked = 'revoked',
	Error = 'error',
}
