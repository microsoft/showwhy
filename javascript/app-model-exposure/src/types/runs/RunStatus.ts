/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { NodeResponseStatus } from '../api/NodeResponseStatus.js'

interface RunTime {
	start: Date
	end?: Date
}

export interface RunStatus {
	percentage: number
	estimated_effect_completed: number
	refute_completed: number
	confidence_interval_completed: number
	shap_completed: number
	status: NodeResponseStatus
	time?: RunTime
	error?: string
}
