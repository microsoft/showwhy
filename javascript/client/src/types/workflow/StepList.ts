/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { Step } from './Step'

export interface StepList {
	id: string
	name: string
	steps: Step[]
	subSteps?: StepList[]
}
