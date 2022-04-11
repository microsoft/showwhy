/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */
import type { NodeResponse } from '@showwhy/types'

import type { RunStatus } from './RunStatus'

export interface RunHistory {
	runNumber: number
	id: string
	isActive: boolean
	refutationCount: number
	hasConfidenceInterval: boolean
	result?: []
	status: RunStatus
	sessionId?: string
	nodeResponse?: NodeResponse
}
