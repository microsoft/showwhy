/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { RunStatus } from './RunStatus'
import { RefutationType } from '../refutation'
import { NodeResponse } from '../api'

export interface RunHistory {
	runNumber: number
	id: string
	isActive: boolean
	refutationType: RefutationType
	hasConfidenceInterval: boolean
	result?: []
	status: RunStatus
	sessionId?: string
	nodeResponse?: NodeResponse
}
