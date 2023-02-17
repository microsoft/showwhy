/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { EstimatedEffect } from '../api/EstimateEffectStatus.js'
import type { NodeResponseStatus } from '../api/NodeResponseStatus.js'
import type { Estimator } from '../estimators/Estimator.js'

interface RunTime {
	start: Date
	end?: Date
}

export interface RunHistory {
	runNumber: number
	project: string
	id: string
	isActive: boolean
	time: RunTime
	estimators: Estimator[]
	status: NodeResponseStatus
	specCount: number
	confidenceIntervalCount: number
	error?: string
	confounderThreshold?: number
	errors?: EstimatedEffect[]
}
