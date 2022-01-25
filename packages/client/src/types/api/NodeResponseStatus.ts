/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

export enum NodeResponseStatus {
	Completed = 'completed',
	Error = 'error',
	Processing = 'processing',
	Pending = 'pending',
	Idle = 'idle',
	Failed = 'failed',
	Running = 'running',
	InProgress = 'in_progress',
	Terminated = 'terminated',
}
