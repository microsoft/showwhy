/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import { StepResource } from './StepResource'
import { StepStatus } from './StepStatus'

export interface Step {
	id: string
	title: string
	guidance: string
	status: StepStatus
	url: string
	showStatus?: boolean
	resources?: StepResource[]
	subStepName?: string
}
