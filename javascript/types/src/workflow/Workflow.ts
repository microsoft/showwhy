/*!
 * Copyright (c) Microsoft. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project.
 */

import type { StepList } from './StepList.js'

export interface Workflow {
	key: string
	name: string
	steps: StepList[]
}
