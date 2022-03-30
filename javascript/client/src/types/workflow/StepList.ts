/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { WorkflowStep } from './WorkflowStep'

export interface StepList {
	id: string
	name: string
	steps: WorkflowStep[]
	subSteps?: StepList[]
}
